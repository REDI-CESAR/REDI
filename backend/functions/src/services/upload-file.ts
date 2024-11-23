import busboy from 'busboy'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'

import { FileInfos, LocalFile } from '@/core/models'

class LocalFileUploader {
  private setupUploadDir(tmpdir: string) {
    if (!fs.existsSync(tmpdir)) {
      fs.mkdirSync(tmpdir, { recursive: true })
    }
  }

  async uploadLocalFile(request: any): Promise<FileInfos> {
    return new Promise((resolve, reject) => {
      const busboyInstance = busboy({ headers: request.headers })

      const tmpdir = 'uploads'

      this.setupUploadDir(tmpdir)

      const fields: Record<string, any> = {}
      const uploads: LocalFile[] = []

      busboyInstance.on('field', (fieldName, val) => {
        fields[fieldName] = val
      })

      const fileWrites: Promise<any>[] = []

      busboyInstance.on('file', (fieldName, file, { filename, mimeType }) => {
        filename = filename.toLowerCase()

        const fileNameGuid = `${randomUUID()}_${filename}`

        const filePath = path.join(tmpdir, fileNameGuid)
        const writeStream = fs.createWriteStream(filePath)

        uploads.push({
          fieldName: fieldName || 'not defined',
          filePath,
          mimeType,
          fileName: filename,
          fileNameGuid
        })

        file.pipe(writeStream)

        const promise = new Promise<void>((resolve, reject) => {
          file.on('end', () => {
            writeStream.end()
          })
          writeStream.on('close', resolve)
          writeStream.on('error', reject)
        })

        fileWrites.push(promise)
      })

      busboyInstance.on('finish', async () => {
        await Promise.all(fileWrites)

        // for (const file of uploads) {
        //   // file.base64 = fs.readFileSync(file.filePath, { encoding: 'base64' })
        //   // fs.unlinkSync(file.filePath);
        // }

        resolve({ uploads, fields })
      })

      busboyInstance.end(request.rawBody)
    })
  }
}

export default LocalFileUploader
