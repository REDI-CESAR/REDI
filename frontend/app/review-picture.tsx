import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Reviewpicture = () => {
  const params = useLocalSearchParams()

  console.log('params', params)

  return (
    <View>
      <Text>Reviewpicture</Text>
    </View>
  )
}

export default Reviewpicture

const styles = StyleSheet.create({})
