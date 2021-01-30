<template>
  <div class="home">
    <HeaderBlock>
      <template v-slot:headline>
        Lav en ny indtastning
      </template>
    </HeaderBlock>
    <VueMap></VueMap>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueMap from '../Components/VueMap.vue';
import MapForm from '../Components/MapForm.vue';
import HeaderBlock from '../Components/HeaderBlock.vue';
@Component({
  components: {
    VueMap,
    MapForm,
    HeaderBlock
  },
})
export default class New extends Vue {}
</script>
