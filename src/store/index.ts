import Vue from 'vue'
import Vuex from 'vuex'
import MapDataObject from '../Models/MapDataObject.Model';
import MapData from './MapData';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapData: <MapDataObject[]>[],
    room: <string> "",
  },
  mutations: {
    setMapDataObject(state, value: MapDataObject){
      let index = state.mapData.findIndex(el => el.name == value.name);
      state.mapData[index] = value;
    },
    setMapData(state, value: []){
      state.mapData = value;
    },
    clearVisited(state){
      state.mapData = state.mapData.map(el => { 
        return {...el, visited: false}
      })
    },
    setVisited(state, data){
      let index = state.mapData.findIndex(el => el.name == data.name);
      state.mapData[index].visited = data.visited;
    },
    setRoom(state, roomName){
      state.room = roomName;
    }
  },
  actions: {
    updateMapDataObject(context, newObject){
      context.commit('setMapDataObject', newObject)
    },
    updateMapDataVisited(context, data){
      context.commit('setVisited', data);
    },
    setInitialMapData(context, mapData){
      context.commit('setMapData', mapData);
    },
    clearAllVisitied(context){
      context.commit('clearVisited');
    },
    setRoom(context, roomName){
      context.commit('setRoom', roomName);
    }

  },
  getters: {
    getMapData: state => {
      return state.mapData;
    },
    getVisitedMapData: state => {
      return state.mapData.filter(el => el.visited);
    },
    getListBySearch(state, search: string){
      return state.mapData.filter( (el) => {
        return el.displayName.toLowerCase().indexOf(search.toLowerCase()) != -1;
      });
    },
    getRoom: state => {
      return state.room;
    },
  },
  modules: {
  }
})
