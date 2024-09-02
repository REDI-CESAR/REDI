import LoginScreen from '@/templates/authentication/login'
import { SafeAreaView } from 'react-native'

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginScreen />
    </SafeAreaView>
  )
}
