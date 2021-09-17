<template>
  <q-layout view="hHh lpR fFf" class="shadow-2">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Timesheet App</q-toolbar-title>
        <div v-if="!$q.screen.lt.md">
          <q-chip v-if="loggedIn">
              <q-avatar>
                <img v-if="currentUser.photoUrl" :src="currentUser.photoUrl">
              </q-avatar>
                {{ currentUser.name }}
          </q-chip>
        </div>
        <div v-else>
            <q-avatar v-if="loggedIn">
              <img v-if="currentUser.photoUrl" :src="currentUser.photoUrl">
            </q-avatar>
        </div>
        <q-btn v-if="loggedIn" @click="logoutUser" flat round dense icon="exit_to_app" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="262"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
    >
          <q-list v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable exact :to="menuItem.to" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
           <q-separator v-if="menuItem.separator" />
          </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const menuList = [
  {
    to: '/timelog',
    icon: 'date_range',
    label: 'Timelog',
    separator: true
  },
  {
    to: '/projects',
    icon: 'work',
    label: 'Projects',
    separator: true
  },
  {
    to: '/reports',
    icon: 'list',
    label: 'My Timelogs',
    separator: true
  }
]

export default {
  data () {
    return {
      drawer: true,
      menuList
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('auth', ['logoutUser'])
  }
}
</script>
