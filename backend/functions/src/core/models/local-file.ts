export type LocalFile = {
  fieldName: string
  filePath: string
  mimeType: string
  fileName: string
  fileNameGuid: string
  fileId?: string
  base64?: any
  bucketInfo?: BucketInfo
  ocrText?: string
}

export type BucketInfo = {
  bucketName: string
  fileName: string
}

export type FileInfos = {
  uploads: LocalFile[]
  fields: Record<string, any>
}
