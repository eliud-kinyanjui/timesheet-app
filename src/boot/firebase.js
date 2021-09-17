import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  // Copy Firebase Config Here
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const fbdb = firebase.firestore()
firebase.firestore().enablePersistence()

export { firebaseAuth, fbdb }
