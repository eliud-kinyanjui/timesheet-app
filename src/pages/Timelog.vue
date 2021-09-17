<template>
  <div class="q-pa-md">
    <div class="row">
      <div>
        <q-form @submit.prevent.stop="onSubmit" class="q-mr-md">
          <q-input color="teal" style="max-width: 300px" ref="search" v-model="searchwords" outlined label="Project Search" :rules="[val => val && val.length > 3 || 'Atleast 4 Searchwords required']" >
          <template v-slot:append>
            <q-avatar>
              <q-icon size="24px" name="search" @click.stop="onSubmit"/>
            </q-avatar>
            <q-icon v-if="searchwords" name="cancel" @click.stop="resetSearch" class="cursor-pointer" />
          </template>
          </q-input>
        </q-form>
      </div>
    </div>
    <q-space/>
    <div v-if="results.length > 0">
      <search-results :results="results"/>
    </div>
    <div v-else>
        <search-results v-if="this.showresults" :results="results"/>
    </div>
    <recent-projects/>
  </div>
</template>

<script>
import { fbdb } from 'boot/firebase'

export default {
  data () {
    return {
      showresults: false,
      searchwords: '',
      results: []
    }
  },
  methods: {
    onSubmit () {
      this.$refs.search.validate()
      if (!this.$refs.search.hasError) {
        this.showresults = false
        if (!isNaN(this.searchwords) & this.searchwords.length === 4) {
          // console.log('Search for Client', this.searchwords)
          this.searchClients()
        } else {
          if (!isNaN(this.searchwords) & this.searchwords.length === 4) {
            // console.log('Search for Project', this.searchwords)
            this.searchProjects()
          } else {
            this.showresults = true
            console.log('Search for opportunity', this.searchwords)
            // this.searchProjectNames()
          }
        }
      }
    },
    resetSearch () {
      this.searchwords = []
      this.results = []
    },
    searchClients () {
      const resultlist = []
      const ref = fbdb.collection('opportunity').where('client.clientnumber', '==', this.searchwords).orderBy('projectnumber', 'desc')
      ref.get().then((queryresult) => {
        if (!queryresult.empty) {
          queryresult.forEach((doc) => {
            resultlist.push({
              id: doc.id,
              data: doc.data()
            })
          })
        } else {
          // console.log('No search results found!')
          this.showresults = true
        }
      })
      this.results = resultlist
    },
    searchProjects () {
      const resultlist = []
      const ref = fbdb.collection('opportunity').where('projectnumber', '==', this.searchwords)
      ref.get().then((queryresult) => {
        if (!queryresult.empty) {
          queryresult.forEach((doc) => {
            resultlist.push({
              id: doc.id,
              data: doc.data()
            })
          })
        } else {
          // console.log('No search results found!')
          this.showresults = true
        }
      })
      this.results = resultlist
    },
    searchProjectNames () {
      this.results = []
      const ref = fbdb.collection('opportunity').where('name', '>=', this.searchwords).where('name', '<=', this.searchwords).limit(5)
      ref.get().then((queryresult) => {
        if (!queryresult.empty) {
          console.log('results found!')
          queryresult.forEach((doc) => {
            console.log(doc.data())
            this.results = { id: doc.id, data: doc.data() }
          })
        } else {
          console.log('No search results found!')
        }
      })
    }
  },
  computed: {
    cleanString (string) {
      return this.$sanitize(string)
    }
  },
  components: {
    'search-results': require('components/SearchResult.vue').default,
    'recent-projects': require('components/RecentProjects.vue').default
  }
}
</script>
