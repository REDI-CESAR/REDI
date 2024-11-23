import { Pressable, StyleSheet, Text, View } from 'react-native'
import ModalComponent from './Modal'
import { useState } from 'react'

import LottieView from 'lottie-react-native'

type LoadingPictureUploadModalProps = {
  onModalClose: () => void
}

const LoadingPictureUploadModal = ({
  onModalClose
}: LoadingPictureUploadModalProps) => {
  function handleModalClose() {
    onModalClose && onModalClose()
  }

  return (
    <ModalComponent
      animationType="slide"
      presentationStyle="fullScreen"
      visible={true}
    >
      <View style={styles.centeredView}>
        <LottieView
          source={require('../assets/animations/wired-outline-56-document.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <View>
          <Text style={styles.textStyle}>Enviando foto</Text>
        </View>

        {/* <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={handleModalClose}
        >
          <Text style={styles.textStyle}>Hide Modal</Text>
        </Pressable> */}
      </View>
    </ModalComponent>
  )
}

export default LoadingPictureUploadModal

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: '#2516c7',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    padding: 10,
    backgroundColor: '#1769aa',
    borderRadius: 4,
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center'
  },
  animation: {
    width: 150,
    height: 150
  }
})
