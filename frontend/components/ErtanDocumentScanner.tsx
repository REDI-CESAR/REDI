import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert
} from 'react-native'
import * as Permissions from 'expo-permissions'

import DocumentScanner from '@ertan95/react-native-document-scanner'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import LoadingPictureUploadModal from './LoadingPictureUploadModal'
import { useRouter } from 'expo-router'
import { ImageOcrResult } from '@/platform/core/models'

export default function ErtanDocumentScanner() {
  const pdfScannerElement = useRef<DocumentScanner>(null)
  const [allowed, setAllowed] = useState(false)
  const [picture, setPicture] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const router = useRouter()

  function handleOnPictureTaken(event: any) {
    setPicture(event)
  }

  async function handleSendTaken() {
    setModalVisible(true)

    const formData = new FormData()

    formData.append('file', {
      uri: picture.croppedImage, //picture.croppedImage as string, // URI of the file
      name: 'photo.jpg', // The name of the file
      type: 'image/jpeg' // The MIME type of the file
    } as any)

    const baseUrl = 'https://uploadimage-fotwrl53aa-uc.a.run.app'

    axios
      .post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((resp) => {
        console.log('resp', resp.data)
        const qrcodeData = resp.data.qrcodeInfo
        const data = {
          school: qrcodeData.school,
          question: qrcodeData.question,
          student: qrcodeData.student
        }

        router.push({
          pathname: 'review-picture',
          params: { image: picture.croppedImage, ...data }
        })
      })
      .catch((err) => {
        const errorMessage =
          err.response.data.message ?? 'Erro ao analisar imagem'
        Alert.alert(errorMessage)
      })
      .finally(() => {
        setModalVisible(false)
      })
  }

  function onRectangleDetect(event: any) {
    console.log('test onRectangleDetect', event)
  }

  function onProcessing(event: any) {}

  function handleOnPress(event: GestureResponderEvent) {
    pdfScannerElement.current && pdfScannerElement.current.capture()
  }

  useEffect(() => {
    async function requestCamera() {
      const result = await Permissions.askAsync(Permissions.CAMERA)
      if (result === 'granted') setAllowed(true)
    }
    requestCamera()
  }, [])

  if (!allowed) {
    return (
      <View>
        <Text>Permissão de Camera</Text>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      {modalVisible && (
        <LoadingPictureUploadModal
          onModalClose={() => setModalVisible(false)}
        />
      )}

      <View
        style={{
          // borderColor: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          flex: 1
        }}
      >
        {isScanning ? (
          picture ? (
            <Image
              source={{ uri: picture.croppedImage }}
              style={styles.preview}
            />
          ) : (
            <DocumentScanner
              ref={pdfScannerElement}
              style={styles.scanner}
              onPictureTaken={handleOnPictureTaken}
              onRectangleDetect={onRectangleDetect}
              onProcessing={onProcessing}
              documentAnimation={true}
              overlayColor="rgba(#1769aa, 0.2)"
              enableTorch={false}
              // manualOnly={true}
              quality={1}
              saturation={0}
              detectionCountBeforeCapture={5}
              detectionRefreshRateInMS={50}
              onDeviceSetup={(event) => {
                // set camera resolution width, height in styles.scanner on start up to avoid scanner disortion
                console.log('onDeviceSetup:', event.height, event.width)
              }}
            />
          )
        ) : (
          <View style={{ flex: 1 }}>
            {/* <Image
              source={require('../assets/images/empty-page.jpeg')}
              style={styles.preview}
            /> */}
            <></>
          </View>
        )}
      </View>

      <View style={{ padding: 20, flexDirection: 'row', columnGap: 10 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setPicture(null)
            setIsScanning(false)
          }}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!isScanning) {
              setIsScanning(true)
            }

            setPicture(null)
          }}
        >
          <Text style={styles.buttonText}>Digitalizar</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.button} onPress={handleOnPress}>
          <Text>TAKE PICTURE</Text>
        </TouchableOpacity> */}

        {picture && (
          <TouchableOpacity style={styles.button} onPress={handleSendTaken}>
            <Text style={styles.buttonText}>Confirmar Envio</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scanner: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  button: {
    padding: 10,
    backgroundColor: '#1769aa',
    borderRadius: 4,
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF'
  }
})
