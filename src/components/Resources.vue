<template>
  <div class="q-pa-md">
    <q-list bordered class="rounded-borders">
      <q-item-label header><b>Selected Resources</b></q-item-label>

      <q-item>
        <q-item-section avatar side>
            <q-icon name="list" color="black" size="20px" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <span class="text-weight-medium">Resources</span>
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <span class="text-weight-medium">Hours</span>
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <span class="text-weight-medium">Qty</span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item v-for="(rslist, key) in rs" :key="key">
        <q-item-section top side>
          <div class="text-grey-8">
            <q-btn size="12px" @click.stop="deleteResources(key)" flat dense round icon="delete" />
          </div>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span class="text-weight-medium">{{ rslist.resourceid.label }}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <span class="text-weight-medium text-center">{{ rslist.resourcehours }}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ rslist.resourceqty }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: ['rs'],
  methods: {
    ...mapActions('timelog', ['deleteResource']),
    deleteResources (id) {
      this.deleteResource(id)
    }
  }
}
</script>
