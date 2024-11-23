import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/platform/core/services'
import { useRouter } from 'expo-router'
import { EmailValidator } from '@/utils/email-validator'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function forgotPassword(email: string) {
    setLoading(true)
    try {
      if (!EmailValidator.isValid(email)) {
        Alert.alert('Email inválido')
        return
      }

      await sendPasswordResetEmail(auth, email)

      setLoading(false)

      // Trigger the alert
      Alert.alert(
        'Email enviado',
        'Um email foi enviado com um link para recuperar a senha.',
        [
          {
            text: 'Ok',
            onPress: () => router.replace('/(tabs)')
          }
        ],
        { cancelable: true }
      )
    } catch (error) {
      Alert.alert('Erro ao recuperar a senha')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotpassword() {
    setLoading(true)

    try {
      await forgotPassword(email)
    } catch (error) {
      Alert.alert('Não foi possível resetar a senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.formWrapper}>
        <View style={styles.formHeader}>
          <Text>Recuperação de senha</Text>
        </View>

        <View style={styles.formContent}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email para recuperar a senha"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formFooter}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotpassword}
          >
            <Text style={styles.buttonText}>Resetar senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24
  },
  formWrapper: {
    minHeight: 200,
    width: '100%',
    marginHorizontal: 'auto',
    rowGap: 5
    // alignItems: 'center'
  },
  formHeader: {},
  formContent: {
    rowGap: 8
  },
  formFooter: {},
  input: {
    height: 50,
    borderColor: '#858585a',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  button: {
    marginTop: 15,
    height: 50,
    backgroundColor: '#1769aa',
    borderRadius: 4,
    // width: '80%',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF'
  }
})
