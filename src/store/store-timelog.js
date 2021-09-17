import Vue from 'vue'
import { uid } from 'quasar'

const state = {
  resourcelogs: [],
  timelogs: []
}

const mutations = {
  addResource (state, resource) {
    const rs = [...state.resourcelogs, resource]
    state.resourcelogs = rs
  },

  addActivity (state, payload) {
    const rs = [...state.timelogs, payload]
    state.timelogs = rs
  },
  deleteResource (state, id) {
    Vue.delete(state.resourcelogs, id)
  },
  resetResource (state) {
    state.resourcelogs = []
  },
  updateResources (state, payload) {
    const rs = [...state.resourcelogs, payload]
    state.resourcelogs = rs
  }
}

const actions = {
  addResource ({ commit }, resource) {
    const rs = { ...resource, id: uid() }
    commit('addResource', rs)
  },

  addActivity ({ commit }, payload) {
    const rs = { ...payload, id: uid(), resources: state.resourcelogs }
    commit('addActivity', rs)
  },
  deleteResource ({ commit }, id) {
    commit('deleteResource', id)
  },
  resetResource ({ commit }) {
    commit('resetResource')
  },
  updateResources ({ commit }, payload) {
    commit('updateResources', payload)
  }
}

const getters = {
  timelog: (state) => {
    return state.timelogs
  },
  resourcelog: (state) => {
    return state.resourcelogs
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
