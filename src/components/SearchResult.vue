<template>
  <div class="q-pt-md">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Search Results</q-toolbar-title>
    </q-toolbar>
   <q-list bordered separator v-if="results.length">
      <q-item v-for="opportunity in results" :key="opportunity.id">
        <q-item-section>
          <q-item-label>{{ opportunity.data.projectnumber }} - {{ opportunity.data.name }}</q-item-label>
          <q-item-label caption>Client: {{ opportunity.data.client.name }}</q-item-label>
          <q-item-label caption>Project Stage: {{ opportunity.data.stagename }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <div class="text-grey-8">
            <q-btn size="16px" @click.stop="addTimelog(opportunity.id, opportunity.data.projectnumber)" flat dense round icon="add_circle" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list v-else bordered separator>
        <q-item>
          <q-item-section>
              <p>No Projects found! Try searching by client or project number.</p>
          </q-item-section>
        </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  props: ['results'],
  methods: {
    addTimelog (projectid, projectnumber) {
      this.$router.push({
        path: '/timelogadd/' + projectid,
        query: { projectnumber: projectnumber }
      })
    }
  }
}
</script>
