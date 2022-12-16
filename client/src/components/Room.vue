<template>
  <div class='room'>
    <div v-bind:class='{ hide: isLoaded }'
      class="loadingContainer"
    >
      <div class="">
        <!--<h2 class="text-h2">Joining room {{ this.roomKey }}</h2>-->
        <h2 class="text-h2">Joining room...</h2>
        <div class="d-flex justify-center mt-5">
          <v-progress-circular
            :size="150"
            :width="7"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
    </div>
    
    <v-row v-bind:class="{ hide: !isLoaded }" class="px-5 pt-5 mt-1">
      <v-col cols="4">
        <v-card class="participants"
          style="background: none !important"
        >
          <v-card-title>Participants</v-card-title>
          <v-list style="background: none !important">
            <v-container
              v-for="p in participants" :key="p"
            >
              <v-list-item>
                <p v-bind:class="{active: name == p, 'font-weight-bold': name == p}">
                  {{ p }} {{ (name==p) ? "(Me)" : "" }}
                </p>
              </v-list-item>            
              <v-divider></v-divider>
            </v-container>
          </v-list>
        </v-card>
        <v-btn 
          @click="leaveRoom()"
          elevation="2"
          rounded
          block
          color="error"
          class="mt-5"
        >
          Leave Room
        </v-btn>
      </v-col>
      <v-col col=8>
        <v-row class="ma-3">
          <v-card class="w100 pa-5" color="rgb(255, 255, 255, 0.7)">
            <h2 class="text-h2">{{ question }}</h2>
          </v-card>
        </v-row>
        <v-row class="ma-3">
          <v-card class="w100" id="chat" color="rgb(255, 255, 255, 0.7)">
            <v-list dense color="rgb(255, 255, 255, 0.7)">
              <v-list-item
                class="tile"
                color="rgb(255, 255, 255, 0.7)"
                v-for="obj in chatTexts[0]" :key="obj.name"
              >
                {{ obj.name }}: {{ obj.chat }}
              </v-list-item>
            </v-list>  
          </v-card>
          <v-card class="w100 mt-5" color="rgb(255, 255, 255, 0.9)">
            <v-form
              ref="form"
              class="pa-5"
              @submit.prevent="sendChat()"
                label="Chat..."
              >
              <v-text-field
                v-model="chatToSend"
              ></v-text-field>
              <v-btn
                color="success"
                :disabled="!valid"
                @click="sendChat()"
              >Send</v-btn>
            </v-form>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import { io } from 'socket.io-client'

  export default {
    name: 'Room',

    data: () => ({
      isLoaded: false,
      id: null,
      participants: [],
      question: '',
      chatTexts: [],
      name: '', // Current User's name
      chatToSend: '',
      socket: null
    }),

    computed: {
      totalNextNeeded: function () {
        return Math.floor(this.participants.length / 2) + 1;
      },
      valid: function () {
        return this.chatToSend != '';
      }
    },

    methods: {
      leaveRoom: async function () {
        this.$router.push({name: 'Main'})
        
        axios.post(`http://localhost:8000/rooms/${this.id}`, {
          name: this.name,
          chat: '/leave'
        })
        this.chatToSend = 'has left the room'
        this.sendChat()

      },
      sendChat: async function () {
        const res = await axios.post(`http://localhost:8000/rooms/${this.id}`, {
          name: this.name,
          chat: this.chatToSend,
        })
        this.chatTexts = res.data

        this.chatToSend = '' /* Clear chat box */
        this.$nextTick(() => {
          var chat = document.getElementById('chat')
          chat.scrollTop = chat.scrollHeight;
        })

        this.socket.emit('save-message', { id: this.id, name: this.name, chat: this.chatToSend })
        console.log('emitted')
      }
    },

    async mounted () {
      let res
      if (this.$route.params.id)
        res = await axios.get(`http://localhost:8000/rooms/${this.$route.params.id}`)
      else
        res = await axios.get(`http://localhost:8000/rooms`)
      let {
        id, participants, question, chatTexts, name
      } = res.data
      
      // Set Initial Data
      this.isLoaded = true;
      this.question = question;
      this.participants = participants;
      this.id = id;
      this.name = name;
      this.chatTexts = chatTexts;

      const path = this.$route.path.slice(-1) == '/' ?  this.$route.path : this.$route.path + '/';
      history.replaceState({}, '', '/room/' + this.id);

      this.chatToSend = " HAS ARRIVED."
      this.sendChat();

      this.socket = io(`http://localhost:4000`, {transports: ['websocket'], upgrade: false})
      this.socket.on('new-message', function (data) {
        if (this.id == data.id) {
          this.chatTexts.push({name: data.name, chat: data.chat})
        }
      }.bind(this))
    },
  }
</script>

<style scoped>
  .hide {
    display: none !important;
  }

  .room {
    height: 100%;
    width: 100%;
  }

  .loadingContainer {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .active {
    color:brown;
  }

  .w100 {
    width: 100%;
  }

  .tile {
    background: rgba(255, 255, 255, .5)
  }
  .tile:hover {
    background: rgba(0, 0, 0, .1)
  }

  #chat {
    height: 300px;
    overflow-y: scroll;
  }
</style>