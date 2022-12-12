<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar app
      :src="navbarBackgroundImg"
    > 
      <v-img
        class="ma-3"
        max-height=75
        max-width=75
        rotate=90
        :src="navbarImg"
        contain
      ></v-img>
      <v-toolbar-title>
        <h3 class="">PhilTalk</h3>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import navbarUrl from './assets/logo.svg'
import navbarBackground from './assets/lowpoly.png'
export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    drawer: null,
    navbarImg: navbarUrl,
    navbarBackgroundImg: navbarBackground
  }),
};
</script>

<style>
  .main {
    background-image: url('./assets/background_red.png');
    background-size: 100% 100%;
  }
  .room {
    background-image: url('./assets/background_mixed.png');
    background-size: 100% 100%;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 1.2s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
</style>
