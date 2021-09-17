<template>
    <q-item>
        <q-item-section>
          <q-item-label>{{ projectno }} - {{ projectname }}</q-item-label>
          <q-item-label caption>Client: {{ clientname }}</q-item-label>
          <q-item-label caption>Project Stage: {{ stagename }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <div class="text-grey-8">
            <q-btn size="16px" @click.stop="addTimelog(projectid, projectno)" flat dense round icon="add_circle" />
          </div>
        </q-item-section>
    </q-item>
</template>

<script>
import { fbdb } from 'boot/firebase'
export default {
  props: ['projectnumber'],
  data () {
    return {
      projectid: '',
      projectno: '',
      projectname: '',
      clientname: '',
      stagename: ''
    }
  },
  methods: {
    addTimelog (projectid, projectno) {
      this.$router.push({
        path: '/timelogadd/' + projectid,
        query: { projectnumber: projectno }
      })
    }
  },
  created () {
    const ref = fbdb.collection('opportunity').where('projectnumber', '==', `${this.projectnumber}`)
    ref.onSnapshot((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          this.projectid = doc.id
          this.projectno = doc.data().projectnumber
          this.projectname = doc.data().name
          this.clientname = doc.data().client.name
          this.stagename = doc.data().stagename
        })
      } else {
        console.log('No document found')
      }
    })
  }
}
</script>
