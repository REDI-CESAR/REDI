import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Permissions from "react-native-permissions";

import DocumentScanner from "@ertan95/react-native-document-scanner";
import { useEffect, useRef, useState } from "react";
import axios from 'axios'

export default function ErtanDocumentScanner() {
  const pdfScannerElement = useRef<DocumentScanner>(null)
  const [allowed, setAllowed] = useState(false)
  const [picture, setPicture] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)

  function handleOnPictureTaken(event: any) {
    console.log('test handleOnPictureTaken', event)
    setPicture(event)
  }

  function handleSendTaken() {
    const formData = new FormData()

    formData.append('file', {
      uri: picture.croppedImage, //picture.croppedImage as string, // URI of the file
      name: 'photo.jpg', // The name of the file
      type: 'image/jpeg' // The MIME type of the file
    } as any)

    const baseUrl =
      'https://7eff-2804-1b2-2044-d3f2-a934-665c-1ab6-394a.ngrok-free.app'

    axios
      .post(`${baseUrl}/redi-cesar-a9458/us-central1/uploadImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((resp) => {
        console.log('resp', resp)
      })
      .catch((err) => {
        console.log('err', err)
        // console.log('err', JSON.stringify(err))
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
      const result = await Permissions.request(
        Platform.OS === 'android'
          ? 'android.permission.CAMERA'
          : 'ios.permission.CAMERA'
      )
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
            <Image
              source={require('../assets/images/empty-page.jpeg')}
              style={styles.preview}
            />
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
          onPress={() => setIsScanning(true)}
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
