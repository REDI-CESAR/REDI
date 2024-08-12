// import admin from 'firebase-admin';
// import { getFirestore } from 'firebase-admin/firestore';
// import { storageBucket } from 'firebase-functions/params';
// import * as fs from 'fs';

// // const app = admin.initializeApp({
// //     credential: admin.credential.applicationDefault(),
// // });

// // const db = getFirestore(app);
// // const data = {
// //     name: 'Los Angeles',
// //     state: 'CA',
// //     country: 'USA'
// // };

// // async function test() {
// //     const res = await db.collection('cities').doc('LA').set(data);
// //     console.log(res);
// // }

// // test();

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBwe8NL4fCIjsZUgIvmIgwAP6HNuwyNdkY",
//   authDomain: "redi-cesar-a9458.firebaseapp.com",
//   projectId: "redi-cesar-a9458",
//   storageBucket: "redi-cesar-a9458.appspot.com",
//   messagingSenderId: "254335469574",
//   appId: "1:254335469574:web:598f671c18c1b4a9cfdb87"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// import { getApp } from "firebase/app";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
// import vision from '@google-cloud/vision';

// // Get a non-default Storage bucket
// const firebaseApp = getApp();
// const storage = getStorage(firebaseApp, "gs://redi-cesar-a9458.appspot.com");
// const docRef = ref(storage, 'redacao-vazia.jpeg');

// const serviceAccount = fs.readFileSync('redacao-vazia.jpeg');
// let storageBucketFilePath = '';
// uploadBytes(docRef, serviceAccount).then(async (snapshot) => {
//   console.log('Uploaded a file!');
//   storageBucketFilePath = snapshot.metadata.fullPath;
//   const client = new vision.ImageAnnotatorClient();
//   const [result] = await client.textDetection(snapshot.metadata.fullPath);
//   const detections = result.textAnnotations;
//   console.log(result.fullTextAnnotation?.text)
//   // console.log('Text: ');
//   // let redacao = ''
//   // detections?.forEach(text => {
//   //   redacao += text.description + '\n';
//   // });

//   // console.log(redacao)
// });
