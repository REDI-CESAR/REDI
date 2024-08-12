import { saveFileGoogleCloud, uploadLocalFile } from '@/services'
import express from 'express'
import { Request } from 'firebase-functions/v2/https'

type Handler = (
  request: Request,
  response: express.Response
) => void | Promise<void>

export const handleUploadFile: Handler = async (request, response) => {
  try {
    response.setHeader('Access-Control-Allow-Origin', '*')

    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

      response.send('')
      return
    }

    const fileInfos = await uploadLocalFile(request)

    const cloudFiles = await saveFileGoogleCloud(fileInfos)

    response.send(cloudFiles)
  } catch (error) {
    console.log('HENRIQUE', error)
    // logger.error('Error processing receipt', { error });

    response.status(500).send('Failed to process receipt')
  }
}
