import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/platform/core/services'
import { useRouter } from 'expo-router'
import { EmailValidator } from '@/utils/email-validator'
import { PasswordValidator } from '@/utils/password-validator'
import { FirebaseError } from 'firebase/app'
import { FirebaseErrorCode } from '@/utils/firebase-error'

type SignupDto = {
  email: string
  password: string
}

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signup({ email, password }: SignupDto) {
    try {
      if (!EmailValidator.isValid(email)) {
        Alert.alert('Email inválido')
        return
      }

      const passwordValidations = PasswordValidator.isValid(password)
      if (!passwordValidations.isValid) {
        Alert.alert(passwordValidations.messages[0])
        return
      }

      await createUserWithEmailAndPassword(auth, email, password)

      router.replace('/home')
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorFirebase = error as FirebaseError

        if (errorFirebase.code === FirebaseErrorCode.emailInUse) {
          Alert.alert('Email existente')
          return
        }
      }

      Alert.alert('Falha ao registrar usuário')
    }
  }

  async function handleSignup() {
    setLoading(true)

    // await new Promise((resolve) => setTimeout(resolve, 5000))

    try {
      const user = await signup({ email, password })
    } catch (error) {
      console.log('HANDLED ERROR handleSignup')
      Alert.alert('Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator
          style={{ flex: 1 }}
          size="large"
          color="#2196f3"
          animating={loading}
        />
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.formWrapper}>
        <View style={styles.formHeader}>
          <Text>Cadastro de Usuário</Text>
        </View>

        <View style={styles.formContent}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.formFooter}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1
  },
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
    flex: 1,
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
