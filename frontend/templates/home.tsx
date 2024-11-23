import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/platform/core/services'

const HomeScreen = () => {
  const router = useRouter()

  async function handleSignOut() {
    try {
      const result = await signOut(auth)

      console.log('result LOGOUT', result)

      router.push('/(tabs)')
    } catch (error) {
      console.log('error LOGOUT', error)

      Alert.alert('Error ao deslogar')
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text>HEADER</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('scanner')}
          >
            <Text style={styles.buttonText}>Scanner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>FOOTER</Text>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    rowGap: 16
  },
  header: {
    alignSelf: 'center'
  },
  content: {
    flex: 1,
    rowGap: 8
  },
  footer: {},
  input: {
    borderColor: '#858585a',
    borderWidth: 1,
    height: 30,
    borderRadius: 8
  },
  buttonWrapper: {},
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#1769aa',
    borderRadius: 4,
    // width: '80%',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    elevation: 2
  }
})
