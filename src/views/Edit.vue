<template>
  <div class="edit">
    <h1>edit</h1>
    <VueMap v-bind:mapKey="$route.params.key"></VueMap>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeaderBoard from '../Components/LeaderBoard.vue';
import VueMap from '../Components/VueMap.vue';
@Component({
  components: {
    LeaderBoard,
    VueMap,
    
  },
})
export default class Edit extends Vue {}
</script>
