import { Response } from 'express'
import { Request } from 'firebase-functions/v2/https'
import Jimp from 'jimp'
import jsQR from 'jsqr'
import { FileInfos } from '@/core/models'
import { UploadResponse } from '@google-cloud/storage'
import { DocumentData, DocumentReference } from 'firebase-admin/firestore'
import admin from 'firebase-admin'
import { File } from '@google-cloud/storage'
import LocalFileUploader from '@/services/upload-file'
import { OpenAiService } from '@/infra/gateways/open-ai/openai'
const QrCodeReader = require('qrcode-reader') // eslint-disable-line @typescript-eslint/no-var-requires

// import { getAuth } from 'firebase-admin/auth'

type PromiseFireStore = Promise<DocumentReference<DocumentData>>

class ImageUploader {
  localFileUploader: LocalFileUploader
  userToken: string

  constructor() {
    this.localFileUploader = new LocalFileUploader()
    this.userToken = ''
  }

  // Function to decode QR code and return a Promise
  decodeQRCode = (image: any) => {
    return new Promise((resolve, reject) => {
      const qrCodeInstance = new QrCodeReader()

      // Set the callback to resolve or reject the promise
      qrCodeInstance.callback = (err: any, value: any) => {
        if (err) {
          return resolve('')
        }
        resolve(value.result)
      }

      // Decode the QR code
      qrCodeInstance.decode(image.bitmap)
    })
  }

  async saveFileGoogleCloud(fileInfos: FileInfos): Promise<File[]> {
    // eslint-disable-line no-useless-catch
    const RECEIPT_COLLECTION = 'arquivos_redacao'
    const uploadPromises: Promise<UploadResponse>[] = []
    const receiptsFireStorePromises: PromiseFireStore[] = []

    fileInfos.uploads.forEach((fileInfo) => {
      const currentFile = structuredClone(fileInfo)

      delete currentFile.base64

      const storagePromise = admin
        .storage()
        .bucket()
        .upload(currentFile.filePath, {
          metadata: {
            contentType: currentFile.mimeType,
            ...currentFile
          }
        })

      uploadPromises.push(storagePromise)

      const fireStorePromise: PromiseFireStore = admin
        .firestore()
        .collection(RECEIPT_COLLECTION)
        .add(currentFile)

      receiptsFireStorePromises.push(fireStorePromise)
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    await Promise.all(receiptsFireStorePromises)

    return uploadedFiles.map((uploadedFile) => uploadedFile[0])
  }

  verifyToken(
    request: Request,
    response: Response
  ): { message?: string; status: number } {
    if (!request.headers.authorization) {
      response.status(403).send({
        message: 'Token não definido'
      })
      return { message: 'Token não definido', status: 403 }
    }

    this.userToken = request.headers.authorization!
    // const userRecord = getAuth()
    //   .verifyIdToken(this.userToken, true)
    //   .then(() => {
    //     return getAuth().getUser(request.body)
    //   })
    //   .catch(() => {
    //     return null
    //   })

    // if (userRecord === null) {
    //   return { message: 'Token expirado', status: 401 }
    // }

    if (!this.userToken) {
      response.status(403).send({
        message: 'Token não definido'
      })
      return { message: 'Token não definido', status: 403 }
    }

    if (this.userToken.length === 0) {
      response.status(403).send({
        message: 'Token vazio'
      })
      return { message: 'Token vazio', status: 403 }
    }

    return { status: 200 }
  }

  async handleUploadFile(request: Request, response: Response) {
    try {
      // const { status, message } = this.verifyToken(request, response)
      // if (status !== 200) {
      //   response.status(status).send({
      //     message
      //   })
      //   return
      // }

      const fileInfos: FileInfos =
        await this.localFileUploader.uploadLocalFile(request)
      let qrcodeInfo = ''

      for (const uploads of fileInfos.uploads) {
        const image: any = await Jimp.read(uploads.filePath)

        const imageData = {
          data: new Uint8ClampedArray(image.bitmap.data),
          width: image.bitmap.width,
          height: image.bitmap.height
        }

        const decodedQR = jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        )

        const qrCode = (await this.decodeQRCode(image)) as string

        if (qrCode) {
          qrcodeInfo = qrCode
        }

        if (!qrcodeInfo && decodedQR && decodedQR.data) {
          qrcodeInfo = decodedQR?.data
        }

        // if (!qrcodeInfo) {
        //   response.status(400).send({
        //     message: 'QRCode não encontrado'
        //   })
        //   return
        // }
      }

      const cloudFiles = await this.saveFileGoogleCloud(fileInfos)

      const { conteudo } = await new OpenAiService().startCompletions(
        fileInfos.uploads[0]
      )

      if (!conteudo || conteudo.length === 0) {
        response.status(400).send({
          message: 'Redação vazia'
        })
        return
      }

      const lines = (conteudo as string).split('<FIM>').length

      if (lines < 5) {
        const media = conteudo.length / 70

        if (media < 5) {
          response.status(400).send({
            message: 'Redação com menos de 5 linhas'
          })
          return
        }
      } else if (lines > 35) {
        const media = conteudo.length / 70

        if (media > 35) {
          console.log('media high', media)
          response.status(400).send({
            message: 'Redação com mais de 35 linhas'
          })
          return
        }
      }

      const qrcodeInfoSpplited = qrcodeInfo?.split(';')

      response.send({
        files: cloudFiles,
        qrcodeInfo: {
          school: qrcodeInfoSpplited[0] || 'E0601',
          question: qrcodeInfoSpplited[1] || 'Q01',
          student: qrcodeInfoSpplited[2] || 'E020079I7'
        }
      })
    } catch (error) {
      console.log('eerrr', error)
      response.status(500).send({
        message: 'Erro ao processar redação'
      })
    }
  }
}

export default ImageUploader
