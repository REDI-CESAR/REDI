import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/platform/core/services'

type SignupDto = {
  email: string
  password: string
}

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signup({ email, password }: SignupDto) {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)

      console.log('RESPONSE USER FIREBASE', user)
    } catch (error) {
      console.log('error signup firebase', error)
      throw error
    }
  }

  async function handleSignup() {
    setLoading(true)
    console.log('executou')

    await new Promise((resolve) => setTimeout(resolve, 5000))

    try {
      const user = await signup({ email, password })
    } catch (error) {
      console.log('HANDLED ERROR handleSignup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.formWrapper}>
        <View style={styles.formHeader}>
          <Text>RegisterScreen</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            {/* <Link href={'home'} style={styles.buttonText}>
              LOGIN
            </Link> */}
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RegisterScreen

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
  formFooter: {},
  input: {
    borderColor: '#858585a',
    borderWidth: 1,
    height: 30,
    borderRadius: 8
  },
  button: {
    marginTop: 20,
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
