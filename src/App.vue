<template>
  <div id="app">
    <div class="app-container">
      <div id="nav">
        <router-link to="/">Ny</router-link> |
        <router-link to="/statistik">Statistik</router-link>
      </div>
      
      <div class="router-wrapper" v-if="getRoom()">
        
        <div class="current-room-badge">
          <div class="current-room-badge__inside">
            <p>Du er i gruppen:</p> 
            <p class="current-room__room-name">{{ getRoom() }}</p>
            <p>
              <span class="button button--primary button--small" v-on:click="leaveRoom()">
              Forlad gruppe
              </span>
            </p>
          </div>
        </div>

        <transition name="fade-quick" mode="out-in">
            <router-view></router-view>
        </transition>
      
      </div>
      
      <transition name="fade-quick" mode="in-out">
        <RoomSelect v-on:pickroom="pickRoom($event)" v-on:createroom="createRoom($event)" v-if="!getRoom()"></RoomSelect>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapDataObject from './Models/MapDataObject.Model';
import MapAPI from './Store/MapApi';
import MapForm from './Components/MapForm.vue';
import RoomSelect from './Components/RoomSelect.vue';
declare global {
    interface Window { 
      mapData: MapDataObject[]; 
      localStorage: WindowLocalStorage
    }
}
@Component({
  components: {
    RoomSelect,
  },
})
export default class App extends Vue {

  mounted(){
    let mapData = [];
    for (const key in window.mapData) {
      let newEl = {
          path: window.mapData[key].path,
          name: window.mapData[key].name,
          displayName: window.mapData[key].displayName,
          visited: false,
      }
      mapData.push(newEl);
    }
    mapData = mapData.sort((a,b) => {
      var textA = a.displayName.toUpperCase();
      var textB = b.displayName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    this.getRoomFromStorage();
    this.$store.dispatch("setInitialMapData", mapData);
  }
  setRoomStorage(roomName: string){
    window.localStorage.setItem('roomcode', roomName);
  }

  getRoomFromStorage(){
    let room = window.localStorage.getItem('roomcode');

    if(room){
      this.$store.dispatch('setRoom', room);
    }
  }
  getRoom(){
    return this.$store.getters.getRoom;
  }
  
  pickRoom(roomName: string){
    this.$store.dispatch('setRoom', roomName);
    this.setRoomStorage(roomName);
  }
  leaveRoom(){
    this.$store.dispatch('setRoom', '');
    this.setRoomStorage('');
    if(this.$route.name !== 'New'){
      this.$router.push({name: 'New'});
    }
  }
}
</script>
<style lang="scss">
  @import '@/Scss/Styles.scss';
  
  
  

</style>
