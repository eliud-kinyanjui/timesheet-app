<template>
  <div class="q-pa-md">
    <q-table
      title="Opportunities"
      :data="timelog"
      row-key="projectnumber"
      :filter="filter"
      @row-click="onRowClick"
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

export default {
  data () {
    return {
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
      filter: '',
      dataloading: true,
      columns: [
        {
          name: 'projectnuber',
          required: true,
          label: 'Project Number',
          align: 'left',
          field: row => row.projectnumber,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'client', align: 'left', label: 'Client', field: 'client', sortable: true },
        { name: 'stagename', align: 'left', label: 'Stage', field: 'stagename', sortable: true }
      ],
      timelog: [],
      ref: firebase.firestore().collection('opportunity').orderBy('projectnumber', 'desc').limit(1000)
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.$router.push({
        path: '/timelogadd/' + row.key,
        query: { projectnumber: row.projectnumber }
      })
    }
  },
  created () {
    this.ref.get().then((querySnapshot) => {
      // var source = querySnapshot.metadata.hasPendingWrites ? 'Local' : 'Server'
      // console.log(source)
      this.timelog = []
      querySnapshot.forEach((doc) => {
        this.timelog.push({
          key: doc.id,
          projectnumber: doc.data().projectnumber,
          name: doc.data().name,
          stagename: doc.data().stagename,
          client: doc.data().client.name
        })
      })
    })
  }
}
</script>
