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

    axios
      .post(
        'https://2889-2804-1b2-2044-8b4d-397f-42a1-7c9-14c.ngrok-free.app/redi-cesar-a9458/us-central1/uploadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
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

  return (
    <View
      style={{
        borderWidth: 2,
        borderStyle: 'solid',
        flex: 1
      }}
    >
      <View style={{ paddingTop: 50, flexDirection: 'row', columnGap: 10 }}>
        <TouchableOpacity
          style={{ height: 50, backgroundColor: 'green' }}
          onPress={handleOnPress}
        >
          <Text>TAKE PICTURE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 50, backgroundColor: 'green' }}
          onPress={() => setPicture(null)}
        >
          <Text>CLEAR PICTURE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ height: 50, backgroundColor: 'green' }}
          onPress={handleSendTaken}
        >
          <Text>SEND PICTURE</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderColor: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          flex: 1
        }}
      >
        {picture ? (
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
            overlayColor="rgba(255,130,0, 0.2)"
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
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scanner: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  preview: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
