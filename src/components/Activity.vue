<template>
  <div>
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Timelog Listing</q-toolbar-title>
    </q-toolbar>
   <q-list bordered separator v-if="activitylist.length">
      <q-item v-for="activity in activitylist" :key="activity.key">
        <q-item-section>
          <q-item-label>{{ activity.projectdetails.activityid.label }}</q-item-label>
          <q-item-label caption>Days: {{ activity.projectdetails.days }}</q-item-label>
          <div v-if="activity.projectdetails.resource.length">
            <q-item-label caption><b>Resources</b></q-item-label>
            <q-item-label separator caption v-for="resources in activity.projectdetails.resource" :key="resources.id">{{ resources.resourceid.label }} | Hrs: {{ resources.resourcehours }} | Qty: {{ resources.resourceqty }}</q-item-label>
          </div>
          <q-item-label caption v-if="activity.projectdetails.comments">Comments: {{ activity.projectdetails.comments }}</q-item-label>
          <q-item-label caption v-if="activity.projectdetails.created">Created: {{ activity.projectdetails.created.toDate() }}</q-item-label>
        </q-item-section>
        <q-item-section side>{{ activity.projectdetails.hours }} Hrs</q-item-section>
        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="edit" @click.stop="editActivity(activity.key)"/>
            <q-btn size="12px" flat dense round icon="delete" @click.stop="deleteActivity(activity.key)"/>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list v-else bordered separator>
        <q-item>
          <q-item-section>
              <p>You have not entered any timelogs under this project</p>
          </q-item-section>
        </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fbdb } from 'boot/firebase'
export default {
  data () {
    return {
      projectid: this.$route.params.projectid,
      projectnumber: this.$route.query.projectnumber,
      activitylist: []
    }
  },
  methods: {
    dateFormat (mydate) {
      const thisdate = new Date(mydate * 1000)
      return thisdate
    },
    deleteActivity (id) {
      fbdb.collection('timelog').doc(id).delete().then(function () {
        console.log('Document successfully deleted!')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
      this.showNotif()
    },
    editActivity (id) {
      this.$router.push('/Timelogedit/' + this.projectid + '/' + id)
    },
    showNotif () {
      this.$q.notify({
        message: 'Timelog Deleted!',
        icon: 'warning',
        color: 'red'
      })
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('timelog', ['projectinfo'])
  },
  created () {
    const activities = []
    const ref = fbdb.collection('timelog').where('projectnumber', '==', `${this.projectnumber}`).where('userinfo.uid', '==', this.currentUser.uid).orderBy('created', 'desc').limit(30)
    ref.onSnapshot((querySnapshot) => {
      activities.splice(0, activities.length)
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          activities.push({
            key: doc.id,
            projectdetails: doc.data()
          })
        })
      } else {
        console.log('no documents found')
      }
    })
    this.activitylist = activities
  }
}
</script>
