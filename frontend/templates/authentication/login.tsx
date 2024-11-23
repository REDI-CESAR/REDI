import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/platform/core/services'
import { useRouter } from 'expo-router'
import { EmailValidator } from '@/utils/email-validator'
import { FirebaseError } from 'firebase/app'
import { PasswordValidator } from '@/utils/password-validator'
import { FirebaseErrorCode } from '@/utils/firebase-error'

type SignupDto = {
  email: string
  password: string
}

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleForgotPassword() {
    router.push('forgotpassword')
  }

  async function handleSignin() {
    setLoading(true)

    try {
      if (!EmailValidator.isValid(email)) {
        Alert.alert('Email inválido')
        return
      }

      if (!password) {
        Alert.alert('Digite uma senha')
        return
      }

      // const passwordValidations = PasswordValidator.isValid(password)
      // if (!passwordValidations.isValid) {
      //   Alert.alert(passwordValidations.messages[0])
      //   return
      // }

      const user = await signInWithEmailAndPassword(auth, email, password)

      router.replace('home')

      console.log('RESPONSE USER FIREBASE', user)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorFirebase = error as FirebaseError

        if (errorFirebase.code === FirebaseErrorCode.invalidCredentials) {
          Alert.alert('Credenciais inválidas')
          return
        }
      }

      Alert.alert('Falha ao realizar login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  function goToSignup() {
    router.push('register')
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
        <View style={styles.formContent}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputText}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputText}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.forgotPassowordWrapper}>
            <TouchableOpacity
              style={styles.forgotPassowordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPassowordLink}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.formFooter}>
        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToSignup}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 24
  },
  formWrapper: {
    minHeight: 200,
    width: '100%',
    marginHorizontal: 'auto',
    rowGap: 5,
    flex: 1,
    justifyContent: 'center'
  },
  formHeader: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  headerTitle: {
    color: '#2196f3',
    fontSize: 24
  },
  formContent: {
    rowGap: 8
  },
  formFooter: {
    marginTop: 50
  },
  inputWrapper: {
    rowGap: 4
  },
  inputText: {
    fontSize: 12
  },
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
  forgotPassowordWrapper: {},
  forgotPassowordButton: {},
  forgotPassowordLink: {},
  buttonText: {
    color: '#FFF'
  }
})
