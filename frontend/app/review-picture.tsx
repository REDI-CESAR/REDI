import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ImageOcrResult } from '@/platform/core/models'
import LoadingPictureUploadModal from '@/components/LoadingPictureUploadModal'

const Reviewpicture = () => {
  const params = useLocalSearchParams()
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)

  const imageOcrResult: ImageOcrResult = {
    image: params.image,
    data: {
      schoolname: 'Escola Teste',
      schoolclassname: 'Turma A',
      studentname: 'Nome do Aluno Teste',
      questiondescription: 'Qual o tema da redação'
    }
  }

  async function handleConfirmSendPicture() {
    setModalVisible(true)

    await new Promise((resolve) => setTimeout(resolve, 6000))

    setModalVisible(false)

    router.dismissAll()
    router.replace('home')
  }

  return (
    <View style={styles.wrapper}>
      {modalVisible && (
        <LoadingPictureUploadModal
          onModalClose={() => setModalVisible(false)}
        />
      )}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageOcrResult.image }} style={styles.preview} />
      </View>

      <View style={styles.infos}>
        <View style={styles.infoWrapper}>
          <View style={styles.label}>
            <Text>Escola:</Text>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={imageOcrResult.data.schoolname}
            />
          </View>

          <View style={styles.label}>
            <Text>Turma:</Text>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={imageOcrResult.data.schoolclassname}
            />
          </View>

          <View style={styles.label}>
            <Text>Nome:</Text>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={imageOcrResult.data.studentname}
            />
          </View>

          <View style={styles.label}>
            <Text>Questão:</Text>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={imageOcrResult.data.questiondescription}
            />
          </View>
        </View>

        <View style={styles.formFooter}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmSendPicture}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Reviewpicture

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  imageWrapper: {
    height: '55%'
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  infos: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12
  },
  infoWrapper: {},
  label: {},
  input: {
    borderColor: '#858585a',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  formFooter: {
    marginTop: 'auto'
  },
  button: {
    marginTop: 10,
    height: 30,
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
