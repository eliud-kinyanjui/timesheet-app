<template>
  <q-page class="q-pa-md">
    <div class="row">
        <div class="text-h5 q-mr-md">
          {{ projectnumber }} -  {{ projectname }}
        </div>
        <q-btn color="primary" icon="keyboard_backspace" label="Back" no-caps to="/Timelog"/>
    </div>
    <hr />
    <form @submit.prevent.stop="onSubmit">
    <div class="row">
      <div class="q-pa-md" style="max-width: 500px">
        <q-select outlined v-model="timelogs.activityid" :options="activity" map-options label="Activity" />
      </div>
      <div class="q-pa-md" style="max-width: 100px">
          <q-input type="number" outlined v-model="timelogs.hours" step="any" label="Hours" ref="hours" :min="0" numeric-keyboard-toggle :rules="[val => val && val > 0 || 'Hours should be grater than zero']"/>
      </div>

      <div class="q-pa-md">
        <q-input filled readonly v-model="timelogs.days" ref="date" label="Date" :rules="[val => val && val.length > 0 || 'Date is required']">
          <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="timelogs.days" multiple>
                  <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                  </q-date>
              </q-popup-proxy>
              </q-icon>
          </template>
          </q-input>
      </div>
    </div>
    <hr/>
     <div class="row">
        <div class="q-pa-md" style="max-width: 500px">
          <q-select outlined v-model="rslogs.resourceid" map-options :options="resources" label="Resource" />
        </div>
        <div class="q-pa-md" style="max-width: 100px">
            <q-input type="number" outlined v-model="rslogs.resourcehours" label="Hours" ref="reshours" step="any" :min="0" :rules="[val => val && val.length > 0 || 'Hours is required']" numeric-keyboard-toggle/>
        </div>
        <div class="q-pa-md" style="max-width: 100px">
            <q-input type="number" outlined v-model="rslogs.resourceqty" label="Qty" ref="qty" step="any" :min="1" :rules="[val => val && val.length > 0 || 'Qty is required']" numeric-keyboard-toggle/>
        </div>
        <div class="q-pa-md" top>
          <q-btn label="Add Resource" color="primary" @click="submitResource"/>
        </div>
     </div>
    <hr/>
    <resources-list v-if="resourcelog.length" :rs="resourcelog"/>

    <div class="q-pa-md">
        <q-input
        label="Comments"
        v-model="timelogs.comments"
        filled
        autogrow
        type="textarea"
        />
    </div>
    <div class="q-pa-md">
        <q-btn icon="save" label="Save Activity" type="submit" color="primary"/>
    </div>
    </form>
    <hr/>
    <activity-list :projectid="projectid" :projectno="projectnumber" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { fbdb } from 'boot/firebase'
import firebase from 'firebase'

export default {
  data () {
    return {
      projectid: this.$route.params.projectid,
      timelogs: {
        activityid: {
          value: '2001',
          label: 'AC001: Client Meeting'
        },
        hours: '1',
        days: [],
        comments: null
      },
      rslogs: {
        resourceid: '',
        resourcehours: '1',
        resourceqty: '1'
      },
      currentdate: '',
      projectnumber: this.$route.query.projectnumber,
      projectname: '',
      resources: [],
      activity: []
    }
  },
  methods: {
    ...mapActions('timelog', ['addResource', 'addActivity', 'resetResource', 'updateProject']),
    onSubmit () {
      this.$refs.date.validate()
      this.$refs.hours.validate()
      if (!this.$refs.date.hasError && !this.$refs.hours.hasError) {
        const ref = fbdb.collection('timelog')
        this.showNotif()
        this.timelogs.projectnumber = this.projectnumber
        this.timelogs.project = { projectno: this.projectnumber, projectname: this.projectname }
        this.timelogs.userinfo = this.currentUser
        this.timelogs.resource = this.resourcelog
        this.timelogs.created = firebase.firestore.FieldValue.serverTimestamp()
        ref.add(this.timelogs).then((docRef) => {
          console.log('Timelogs added.')
        })
          .catch((error) => {
            console.log('Error adding document: ', error)
          })
        this.addActivity(this.timelogs)
        this.resetResource()
      }
    },
    submitResource () {
      this.$refs.qty.validate()
      this.$refs.reshours.validate()
      console.log(this.rslogs)
      if (!this.$refs.qty.hasError && !this.$refs.reshours.hasError) {
        this.addResource(this.rslogs)
      }
    },
    resetResources () {
      this.resetResource()
    },
    showNotif () {
      this.$q.notify({
        message: 'Timelog Saved!',
        icon: 'announcement',
        color: 'green'
      })
    },
    getCurrentDateTime () {
      var today = new Date()
      return today.toLocaleString()
    },
    getCurrentDate () {
      var today = new Date()
      this.currentdate = today.toLocaleString()

      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0')
      var yyyy = today.getFullYear()

      today = yyyy + '/' + mm + '/' + dd
      this.timelogs.days = today
    },
    updateProjectInfo () {
      const ref = fbdb.collection('opportunity').doc(this.projectid)
      ref.get().then((doc) => {
        this.projectnumber = doc.data().projectnumber
        this.projectname = doc.data().name
      })
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn', 'currentUser']),
    ...mapGetters('timelog', ['timelog', 'resourcelog'])
  },
  created () {
    this.getCurrentDate()
    this.updateProjectInfo()
    const acts = fbdb.collection('activity').orderBy('code', 'desc')
    const activity = []
    acts.get().then((doc) => {
      doc.forEach(function (docs) {
        activity.push({
          value: docs.id,
          label: docs.data().code + ': ' + docs.data().name
        })
      })
      this.activity = activity
    })

    const res = fbdb.collection('resource').orderBy('code', 'asc')
    const resources = []
    res.get().then((doc) => {
      doc.forEach(function (docs) {
        resources.push({
          value: docs.id,
          label: docs.data().code + ': ' + docs.data().name
        })
      })
      this.resources = resources
    })
  },
  mounted () {
    this.resetResources()
    this.timelogs.activityid = { value: '2001', label: 'AC001: Client Meeting' }
    this.rslogs.resourceid = { value: '1001', label: 'RS001: Laptop' }
  },
  components: {
    'resources-list': require('components/Resources.vue').default,
    'activity-list': require('components/Activity.vue').default
  }
}
</script>
