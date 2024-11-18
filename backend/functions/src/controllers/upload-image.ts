import express, { Response } from 'express'
import { Request } from 'firebase-functions/v2/https'
import vision from '@google-cloud/vision'
import Jimp from 'jimp';
import jsQR from 'jsqr';
import { FileInfos } from '@/core/models';
import { UploadResponse, File as FireStorageFile } from '@google-cloud/storage'
import { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import admin from 'firebase-admin'
import { File } from '@google-cloud/storage';
import LocalFileUploader from '@/services/upload-file';
import { getAuth } from 'firebase-admin/auth';

type Handler = (
  request: Request,
  response: express.Response
) => void | Promise<void>

type PromiseFireStore = Promise<DocumentReference<DocumentData>>

class ImageUploader {
  localFileUploader: LocalFileUploader;
  userToken: string;

  constructor () {
    this.localFileUploader = new LocalFileUploader();
    this.userToken = "";
  }

  async saveFileGoogleCloud(fileInfos: FileInfos): Promise<File[]> {
    try {
      // eslint-disable-line no-useless-catch
      const RECEIPT_COLLECTION = 'arquivos_redacao'
      const uploadPromises: Promise<UploadResponse>[] = []
      const receiptsFireStorePromises: PromiseFireStore[] = []
  
      fileInfos.uploads.forEach((fileInfo) => {
        const storagePromise = admin
          .storage()
          .bucket()
          .upload(fileInfo.filePath, {
            metadata: {
              contentType: fileInfo.mimeType,
              ...fileInfo
            }
          })
  
        uploadPromises.push(storagePromise)
  
        const fireStorePromise: PromiseFireStore = admin
          .firestore()
          .collection(RECEIPT_COLLECTION)
          .add(fileInfo)
  
        receiptsFireStorePromises.push(fireStorePromise)
      })
  
      const uploadedFiles = await Promise.all(uploadPromises)
      await Promise.all(receiptsFireStorePromises)
  
      return uploadedFiles.map((uploadedFile) => uploadedFile[0])
    } catch (error) {
      // TODO: Throw CUSTOM ERROR
      throw error
    }
  }

  private verifyToken (request: Request, response: Response): { message?: string, status: number } {
    if (!request.headers.authorization) {
      response.status(403).send({
        message: 'Token não definido'
      });
      return { message: 'Token não definido', status: 403 };
    }

    this.userToken = request.headers.authorization!;
    const userRecord = getAuth()
      .verifyIdToken(this.userToken, true)
      .then(() => {
        return getAuth().getUser(request.body)
      })
      .catch(() => {
        return null;
      })

    if (userRecord === null) {
      return { message: 'Token expirado', status: 401 }
    }

    if (!this.userToken) {
      response.status(403).send({
        message: 'Token não definido'
      });
      return { message: 'Token não definido', status: 403 };
    }

    if (this.userToken.length === 0) {
      response.status(403).send({
        message: 'Token vazio'
      });
      return { message: 'Token vazio', status: 403 };
    }

    return { status: 200 };
  }

  async handleUploadFile(request: Request, response: Response) {
    try {
      response.setHeader('Access-Control-Allow-Origin', '*')
  
      const { status, message } = this.verifyToken(request, response);
      if (status !== 200) {
        response.status(status).send({
          message
        })
        return;
      }
  
      if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
        response.send('')
        return
      }
  
      const fileInfos: FileInfos = await this.localFileUploader.uploadLocalFile(request)
      let qrcodeInfo: string = '';
  
      for (const uploads of fileInfos.uploads) {
        const image: any = await Jimp.read(uploads.filePath);
  
        const imageData = {
            data: new Uint8ClampedArray(image.bitmap.data),
            width: image.bitmap.width,
            height: image.bitmap.height,
        };

        const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

        if (!decodedQR) {
          response.status(400).send({
            message: 'QRCode não encontrado'
          })
          return;
        }

        qrcodeInfo = decodedQR.data;
      }
  
      const cloudFiles = await this.saveFileGoogleCloud(fileInfos);
  
      const client = new vision.ImageAnnotatorClient()
  
      for (const cloudFile of cloudFiles) {
        const imageBucket = `gs://${cloudFile?.metadata.bucket}/${cloudFile?.metadata.name}`
        // const imageBucket = `gs://${cloudFile?.metadata.bucket}/redacao-vazia.jpeg`
        // const imageBucket = `gs://${cloudFile?.metadata.bucket}/redacao-preenchida.jpeg`
        // const imageBucket = `gs://${cloudFile?.metadata.bucket}/redacao-refael-exemplo.png`
  
        // NOTE: REGEX INICAL (testar) para pegar o conteúdo da redacao
        ///[aá]rea de (.*)\: [\s\S]<?texto_redacao>(.*)[\s\S](caed|nees|brasil)/gi
  
        const [result] = await client.textDetection(imageBucket)
  
        const text = result.fullTextAnnotation?.text;
        if (text?.length === 0 || text === undefined) {
          response.status(400).send({
            message: 'Redação vazia'
          });
        }
  
        const lines = text?.split('\n');
        if (lines?.length! < 5) {
          response.status(400).send({
            message: 'Redação com menos de 5 linhas'
          });
        } else if (lines?.length! > 35) {
          response.status(400).send({
            message: 'Redação com mais de 35 linhas'
          });
        }
      }
  
      response.send({
        files: cloudFiles,
        qrcodeInfo
      })
    } catch (error) {
      response.status(500).send('Falha ao ler a redação');
    }
  }
}

export default ImageUploader;