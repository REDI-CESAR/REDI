import './config/module-alias'

import { onRequest } from 'firebase-functions/v2/https'

import admin from 'firebase-admin'
import ImageUploader from './controllers/upload-image'
// import {
//   databaseURL,
//   projectID,
//   storageBucket
// } from 'firebase-functions/params'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBwe8NL4fCIjsZUgIvmIgwAP6HNuwyNdkY',
  authDomain: 'redi-cesar-a9458.firebaseapp.com',
  projectId: 'redi-cesar-a9458',
  storageBucket: 'redi-cesar-a9458.appspot.com',
  messagingSenderId: '254335469574',
  appId: '1:254335469574:web:598f671c18c1b4a9cfdb87'
}

admin.initializeApp(firebaseConfig)

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   storageBucket: storageBucket.value(),
//   databaseURL: databaseURL.value(),
//   projectId: projectID.value()
// })

const imageUploader = new ImageUploader()
export const uploadImage = onRequest(
  { cors: true },
  imageUploader.handleUploadFile.bind(imageUploader)
)

