<template>
  <q-page class="q-pa-md">
    <div class="row">
        <div class="text-h5 q-mr-md">
          Edit: {{ projectnumber }} -  {{ projectname }}
        </div>
        <q-btn color="primary" icon="keyboard_backspace" label="Back" no-caps :to="{path: '/timelogadd/' + projectid, query: { projectnumber: projectnumber} }"/>
    </div>
    <hr />
    <form @submit.prevent.stop="onSubmit">
    <div class="row">
      <div class="q-pa-md" style="max-width: 500px">
        <q-select outlined v-model="timelogs.activityid" :options="activity" map-options label="Activity" />
      </div>
      <div class="q-pa-md" style="max-width: 100px">
          <q-input type="number" outlined v-model="timelogs.hours" step="any" label="Hours" numeric-keyboard-toggle/>
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
            <q-input type="number" outlined v-model="rslogs.resourcehours" label="Hours" step="any" numeric-keyboard-toggle/>
        </div>
        <div class="q-pa-md" style="max-width: 100px">
            <q-input type="number" outlined v-model="rslogs.resourceqty" label="Qty" step="any" numeric-keyboard-toggle/>
        </div>
        <div class="q-pa-md" style="max-width: 300px">
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
        <q-btn label="Update Activity" type="submit" color="primary"/>
    </div>
    </form>
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
      timelogid: this.$route.params.timelogid,
      timelogs: {
        activityid: [],
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
      projectnumber: '',
      projectname: '',
      resources: [],
      activity: [],
      projectdetails: []
    }
  },
  methods: {
    ...mapActions('timelog', ['addResource', 'addActivity', 'resetResource', 'updateProject', 'updateResources']),
    onSubmit () {
      this.$refs.date.validate()
      if (!this.$refs.date.hasError) {
        const ref = fbdb.collection('timelog')
        this.showNotif()
        ref.doc(this.timelogid).update({
          'activityid.value': this.timelogs.activityid.value,
          'activityid.label': this.timelogs.activityid.label,
          hours: this.timelogs.hours,
          modified: firebase.firestore.FieldValue.serverTimestamp(),
          days: this.timelogs.days,
          comments: this.timelogs.comments,
          resource: this.resourcelog
        })
          .then(function () {
            console.log('Document successfully updated!')
          })
        this.resetResources()
        this.$router.push({
          path: '/timelogadd/' + this.projectid,
          query: { projectnumber: this.projectnumber }
        })
      }
    },
    submitResource () {
      this.addResource(this.rslogs)
    },
    resetResources () {
      this.resetResource()
    },
    showNotif () {
      this.$q.notify({
        message: 'Timelog Updated!',
        icon: 'announcement',
        color: 'green'
      })
    },
    fixResource (res) {
      res.forEach((docs) => {
        this.updateResources(docs)
      })
    },
    getTimelog () {
      const ref = fbdb.collection('timelog').doc(this.timelogid)
      ref.get().then((doc) => {
        this.timelogs.hours = doc.data().hours
        this.timelogs.days = doc.data().days
        this.timelogs.activityid = { value: doc.data().activityid.value, label: doc.data().activityid.label }
        this.timelogs.comments = doc.data().comments
        this.fixResource(doc.data().resource)
      })
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
  mounted () {
    this.resetResources()
    this.getTimelog()
    this.updateProjectInfo()
  },
  created () {
    const acts = fbdb.collection('activity').orderBy('parentactivity.id', 'desc')
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
      this.rslogs.resourceid = { value: '1001', label: 'RS001: Laptop' }
    })
  },
  components: {
    'resources-list': require('components/Resources.vue').default
  }
}
</script>
