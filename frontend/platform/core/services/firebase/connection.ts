// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, initializeAuth } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBwe8NL4fCIjsZUgIvmIgwAP6HNuwyNdkY',
  authDomain: 'redi-cesar-a9458.firebaseapp.com',
  projectId: 'redi-cesar-a9458',
  storageBucket: 'redi-cesar-a9458.appspot.com',
  messagingSenderId: '254335469574',
  appId: '1:254335469574:web:598f671c18c1b4a9cfdb87'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Authentication Module
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// })
const auth = getAuth(app)

export { db, app, auth }
