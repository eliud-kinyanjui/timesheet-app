/* eslint-disable no-empty-pattern */
import firebase from 'firebase'
import { LocalStorage } from 'quasar'
import { firebaseAuth } from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {
  loggedIn: true,
  currentUser: []
}

const mutations = {
  setLoggedIn (state, value) {
    state.loggedIn = value
  },
  updateCurrentUser (state, payload) {
    state.currentUser = payload
  }
}

const actions = {
  socialLogin () {
    const provider = new firebase.auth.GoogleAuthProvider()
    // firebaseAuth.signInWithRedirect(provider)
    firebaseAuth.signInWithPopup(provider)
      .then(response => {
        // this.updateCurrentUser()
      })
      .catch(error => {
        showErrorMessage(error.message)
      })
  },
  logoutUser () {
    console.log('logoutUser')
    firebaseAuth.signOut()
  },
  updateCurrentUser ({ commit }) {
    const currentUser = firebaseAuth.currentUser()
    commit('updateCurrentUser', currentUser)
  },
  handleAuthStateChange ({ commit }) {
    firebaseAuth.onAuthStateChanged(user => {
      // Loading.hide()
      if (user) {
        const name = user.displayName
        const email = user.email
        const photoUrl = user.photoURL
        const emailVerified = user.emailVerified
        const uid = user.uid
        const userinfo = { name, email, photoUrl, emailVerified, uid }

        commit('updateCurrentUser', userinfo)
        commit('setLoggedIn', true)
        LocalStorage.set('loggedIn', true)
        this.$router.push('/')
      } else {
        const userinfo = []
        commit('setLoggedIn', false)
        commit('updateCurrentUser', userinfo)
        LocalStorage.set('loggedIn', false)
        this.$router.replace('/login')
      }
    })
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
