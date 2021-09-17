<template>
  <div class="q-pa-md">
    <q-table
      title="My Timelog Entries"
      :data="timelog"
      row-key="key"
      :filter="filter"
      :pagination.sync="pagination"
      :columns="columns"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
      filter: '',
      dataloading: true,
      columns: [
        { name: 'user', align: 'left', label: 'User', field: 'user', sortable: true },
        {
          name: 'opportunity',
          required: true,
          label: 'Opportunity',
          align: 'left',
          field: row => row.opportunity,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'activity', align: 'left', label: 'Activity', field: 'activity', sortable: true },
        { name: 'hours', align: 'left', label: 'Hours', field: 'hours', sortable: true },
        { name: 'days', align: 'left', label: 'Days', field: 'days', sortable: false }
      ],
      timelog: []
    }
  },
  methods: {
    datesort (date) {
      if (Array.isArray(date)) {
        return this.datejoin(date.sort())
      } else {
        return date
      }
    },
    datejoin (date) {
      return date.join(', ')
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  created () {
    // const ref = firebase.firestore().collection('timelog').where('userinfo.uid', '==', this.currentUser.uid).orderBy('created', 'desc')
    const ref = firebase.firestore().collection('timelog').orderBy('created', 'desc')
    ref.get().then((querySnapshot) => {
      this.timelog = []
      querySnapshot.forEach((doc) => {
        this.timelog.push({
          key: doc.id,
          opportunity: doc.data().projectnumber + ' ' + doc.data().project.projectname,
          user: doc.data().userinfo.name,
          days: this.datesort(doc.data().days),
          hours: doc.data().hours,
          activity: doc.data().activityid.label
        })
      })
    })
  }
}
</script>
