<template>
  <div class="q-pt-md">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>My Recent Projects</q-toolbar-title>
    </q-toolbar>
      <q-list bordered separator v-if="projects.length > 0">
        <opportunity-list v-for="opportunity in projects" :key="opportunity" :projectnumber="opportunity"/>
      </q-list>
      <q-list v-else bordered separator>
          <q-item>
            <q-item-section>
                <p>No Projects found!</p>
            </q-item-section>
          </q-item>
      </q-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase'

export default {
  data () {
    return {
      results: [],
      projects: []
    }
  },
  methods: {
    removeDuplicates () {
      this.projects = [...new Set(this.results)]
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  created () {
    const ref = firebase.firestore().collection('timelog').where('userinfo.uid', '==', this.currentUser.uid).orderBy('created', 'desc')
    ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.results.push(doc.data().projectnumber)
      })
      this.removeDuplicates()
    })
  },
  components: {
    'opportunity-list': require('components/Opportunity.vue').default
  }
}
</script>
