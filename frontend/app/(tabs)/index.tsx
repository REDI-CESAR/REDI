import ErtanDocumentScanner from "@/components/ErtanDocumentScanner";
import RegisterScreen from '@/templates/authentication/register'
import { SafeAreaView } from 'react-native'

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RegisterScreen />
    </SafeAreaView>
  )
}
