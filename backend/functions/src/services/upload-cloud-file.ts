import admin from 'firebase-admin'
import { DocumentData, DocumentReference } from 'firebase-admin/firestore'
import { UploadResponse, File as FireStorageFile } from '@google-cloud/storage'

import { FileInfos } from '@/core/models'

type PromiseFireStore = Promise<DocumentReference<DocumentData>>

type Setup = (input: FileInfos) => Promise<FireStorageFile[]>

export const saveFileGoogleCloud: Setup = async (fileInfos) => {
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
