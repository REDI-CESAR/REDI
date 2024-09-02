import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const HomeScreen = () => {
  const router = useRouter()

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text>HEADER</Text>
      </View>
      <View style={styles.content}>
        <Text>AQUI COLOCAREMOS BOTÃO COMO SE FOSSE MENU?</Text>
        <Text>Podemos Usar Stack, Drawer ou Tabs navigation</Text>
        <Text>Vou jogar o botão para tela do scanner</Text>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('scanner')}
          >
            <Text style={styles.buttonText}>Scanner</Text>
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
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    rowGap: 16
  },
  header: {},
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
    height: 30,
    backgroundColor: 'blue',
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
