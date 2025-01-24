import ImageUploader from './upload-image'
import { Response } from 'express'
import { Request } from 'firebase-functions/v2/https'

describe('[ImageUploader]', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      body: {}
    } as Partial<Request>
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    } as Partial<Response>
  })

  describe('[handleUploadFile]', () => {
    it('should return error 500 if uploadLocalFile throws an error', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockRejectedValueOnce(new Error('MOCKED_ERROR'))

      try {
        await sut.handleUploadFile(
          mockRequest as Request,
          mockResponse as Response
        )
      } catch (error) {
        // expect(error).toEqual(new Error('MOCKED_ERROR'))
        expect(mockResponse.statusCode).toBe(500)
        expect(mockResponse.send).toHaveBeenCalledWith({
          message: 'Erro ao processar redação'
        })
      }
    })

    it('should call uploadLocalFile once', async () => {
      const sut = new ImageUploader()

      const spy = jest.spyOn(sut.localFileUploader, 'uploadLocalFile')

      spy.mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      try {
        await sut.handleUploadFile(
          mockRequest as Request,
          mockResponse as Response
        )

        expect(spy.mock.calls).toBe(1)
      } catch (error) {}
    })

    it('should return error 500 if decodeQRCode throws an error', async () => {
      const sut = new ImageUploader()

      const spy = jest.spyOn(sut, 'decodeQRCode')

      spy.mockRejectedValue(new Error('MOCKED ERROR'))

      try {
        await sut.handleUploadFile(
          mockRequest as Request,
          mockResponse as Response
        )
      } catch (error) {
        expect(mockResponse.statusCode).toBe(500)
        expect(mockResponse.send).toHaveBeenCalledWith({
          message: 'Erro ao processar redação'
        })
      }
    })

    it('should call saveFileGoogleCloud once', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))
      jest
        .spyOn(sut, 'decodeQRCode')
        .mockImplementation(jest.fn().mockResolvedValue(null))

      const spy = jest.spyOn(sut, 'saveFileGoogleCloud')

      spy.mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      await sut.handleUploadFile(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(spy).toHaveBeenCalled()
      expect(spy).toHaveBeenCalledWith({ uploads: [] })
    })

    it('should return error 500 if saveFileGoogleCloud throws an error', async () => {
      const sut = new ImageUploader()

      const spy = jest.spyOn(sut, 'saveFileGoogleCloud')

      spy.mockRejectedValue(new Error('MOCKED ERROR'))

      try {
        await sut.handleUploadFile(
          mockRequest as Request,
          mockResponse as Response
        )
      } catch (error) {
        expect(mockResponse.statusCode).toBe(500)
        expect(mockResponse.send).toHaveBeenCalledWith({
          message: 'Erro ao processar redação'
        })
      }
    })

    it('should call startCompletions once', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))
      jest
        .spyOn(sut, 'decodeQRCode')
        .mockImplementation(jest.fn().mockResolvedValue(null))

      jest
        .spyOn(sut, 'saveFileGoogleCloud')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      const spy = jest.spyOn(sut.openAiService, 'startCompletions')

      spy.mockImplementation(jest.fn().mockResolvedValue({ conteudo: '' }))

      await sut.handleUploadFile(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(spy).toHaveBeenCalled()
    })

    it('should return a error message if conteudo is not found', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))
      jest
        .spyOn(sut, 'decodeQRCode')
        .mockImplementation(jest.fn().mockResolvedValue(null))

      jest
        .spyOn(sut, 'saveFileGoogleCloud')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      const spy = jest.spyOn(sut.openAiService, 'startCompletions')

      spy.mockImplementation(jest.fn().mockResolvedValue({ conteudo: '' }))

      await sut.handleUploadFile(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Redação vazia'
      })
    })

    it('should return a error message if conteudo has less than 5 lines', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))
      jest
        .spyOn(sut, 'decodeQRCode')
        .mockImplementation(jest.fn().mockResolvedValue(null))

      jest
        .spyOn(sut, 'saveFileGoogleCloud')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      const spy = jest.spyOn(sut.openAiService, 'startCompletions')

      spy.mockImplementation(
        jest.fn().mockResolvedValue({ conteudo: '<FIM> <FIM>' })
      )

      await sut.handleUploadFile(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Redação com menos de 5 linhas'
      })
    })

    it('should return a error message if conteudo i', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))
      jest
        .spyOn(sut, 'decodeQRCode')
        .mockImplementation(jest.fn().mockResolvedValue(null))

      jest
        .spyOn(sut, 'saveFileGoogleCloud')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      const spy = jest.spyOn(sut.openAiService, 'startCompletions')

      spy.mockImplementation(
        jest.fn().mockResolvedValue({
          conteudo:
            '<FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> '
        })
      )

      await sut.handleUploadFile(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Redação com mais de 35 linhas'
      })
    })

    it('should return a valid object on reponse. ', async () => {
      const sut = new ImageUploader()

      jest
        .spyOn(sut.localFileUploader, 'uploadLocalFile')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))
      jest
        .spyOn(sut, 'decodeQRCode')
        .mockImplementation(jest.fn().mockResolvedValue(null))

      jest
        .spyOn(sut, 'saveFileGoogleCloud')
        .mockImplementation(jest.fn().mockResolvedValue({ uploads: [] }))

      const spy = jest.spyOn(sut.openAiService, 'startCompletions')

      spy.mockImplementation(
        jest.fn().mockResolvedValue({
          conteudo:
            '<FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> <FIM> '
        })
      )

      await sut.handleUploadFile(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.send).toHaveBeenCalledWith({
        files: { uploads: [] },
        qrcodeInfo: {
          school: 'E0601',
          question: 'Q01',
          student: 'E020079I7'
        }
      })
    })
  })
})
