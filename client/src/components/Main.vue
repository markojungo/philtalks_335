<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class='main d-flex align-center' :style="{ backgroundImage: 'url(' + mainBack + ')' }">
    <v-container class='d-flex justify-center'>
      <RouterLink 
        to="/room"  
        class='text-bold text-decoration-none d-block'
      >
        <v-btn
          elevation="4"
          class=""
          x-large
          color="secondary"
        >
          Join Random Room
        </v-btn>
      </RouterLink>
    </v-container>
    <v-container class='welcome my-2'>
      <h1 class="text-h2 mt-6">Welcome!</h1>
      <div>
      <p class="text-subtitle-1 mt-4">Discuss philosophical questions with others on the internet!</p>
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'MainView',
    data: () => ({
      mainBack: null,
    }),
    async mounted() {
      const res = await axios.get("https://cataas.com/cat")
      console.log(res)
      this.mainBack = URL.createObjectURL(await res.blob())
      console.log(this.mainBack)
    }
  }
</script>

<style scoped>
  .main {
    height: 100%;
  }

  .welcome {
    background-color: rgba(255, 255, 255, 0.29);
  }
</style>