<template>
  <div class="home">
      <VueMap></VueMap>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueMap from '../Components/VueMap.vue';
import MapForm from '../Components/MapForm.vue';
@Component({
  components: {
    VueMap,
    MapForm,
  },
})
export default class New extends Vue {}
</script>
