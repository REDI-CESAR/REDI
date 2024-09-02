import { StyleSheet, Modal, Alert, ModalProps } from 'react-native'
import React, { useState } from 'react'

type ModalComponentProps = {
  children: React.ReactNode
} & ModalProps

const ModalComponent = ({ children, ...rest }: ModalComponentProps) => {
  return (
    <Modal {...rest} animationType="slide" presentationStyle="fullScreen">
      {children}
    </Modal>
  )
}

export default ModalComponent

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
