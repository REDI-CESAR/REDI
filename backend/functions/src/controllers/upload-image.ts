import { saveFileGoogleCloud, uploadLocalFile } from '@/services'
import express from 'express'
import { Request } from 'firebase-functions/v2/https'
import vision from '@google-cloud/vision'

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

    const client = new vision.ImageAnnotatorClient()

    for (const cloudFile of cloudFiles) {
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/${cloudFile?.metadata.name}`
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/redacao-vazia.jpeg`
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/redacao-preenchida.jpeg`
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/redacao-refael-exemplo.png`

      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/EXEMPLO_EM_BRANCO.jpeg`
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/EXEMPLO_TEXTO_1_LINHA.jpeg`
      const imageBucket = `gs://${cloudFile?.metadata.bucket}/EXEMPLO_TEXTO_32_LINHAS.jpeg`
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/EXMEMPLO_31_LINHAS.jpeg`
      // const imageBucket = `gs://${cloudFile?.metadata.bucket}/EXMPLO_TEXTO_25_LINHAS.jpeg`

      // NOTE: REGEX INICAL (testar) para pegar o conteúdo da redacao
      ///[aá]rea de (.*)\: [\s\S]<?texto_redacao>(.*)[\s\S](caed|nees|brasil)/gi

      const [result] = await client.textDetection(imageBucket)

      console.log('result', result.fullTextAnnotation?.text)
    }

    response.send(cloudFiles)
  } catch (error) {
    console.log('HENRIQUE', error)
    // logger.error('Error processing receipt', { error });

    response.status(500).send('Failed to process receipt')
  }
}
