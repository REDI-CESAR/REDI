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
  apiKey: 'AIzaSyB_bAHcUSvNL93kzJeXE3A_C8UgHJdgXp0',
  authDomain: 'redi-cesar.firebaseapp.com',
  projectId: 'redi-cesar',
  storageBucket: 'redi-cesar.appspot.com',
  messagingSenderId: '980395956110',
  appId: '1:980395956110:web:ff23875793bfbec02876df',
  measurementId: 'G-7ZWQ39Z62H'
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
