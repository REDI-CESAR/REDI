import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/platform/core/services'
import { useRouter } from 'expo-router'

type SignupDto = {
  email: string
  password: string
}

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signup({ email, password }: SignupDto) {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)

      router.replace('home')

      console.log('RESPONSE USER FIREBASE', user)
    } catch (error) {
      console.log('error signup firebase', error)
      throw error
    }
  }

  async function handleSignin() {
    setLoading(true)
    console.log('executou')

    await new Promise((resolve) => setTimeout(resolve, 5000))

    try {
      const user = await signup({ email, password })
    } catch (error) {
      console.log('HANDLED ERROR handleSignin')
    } finally {
      setLoading(false)
    }
  }

  function goToSignup() {
    router.push('register')
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.formWrapper}>
        <View style={styles.formHeader}>
          <Text>LoginScreen</Text>
        </View>

        <View style={styles.formContent}>
          <TextInput
            style={styles.input}
            placeholder="email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
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
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  formFooter: {
    marginTop: 50
  },
  input: {
    borderColor: '#858585a',
    borderWidth: 1,
    height: 30,
    borderRadius: 8
  },
  button: {
    marginTop: 10,
    height: 30,
    backgroundColor: 'blue',
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
