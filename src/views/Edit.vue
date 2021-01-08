<template>
  <div class="edit">
     <HeaderBlock>
      <template v-slot:headline>
        Rediger indtastning
      </template>
    </HeaderBlock>
    <VueMap v-bind:mapKey="$route.params.key"></VueMap>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeaderBoard from '../Components/LeaderBoard.vue';
import VueMap from '../Components/VueMap.vue';
import HeaderBlock from '../Components/HeaderBlock.vue';
@Component({
  components: {
    LeaderBoard,
    VueMap,
    HeaderBlock
    
  },
})
export default class Edit extends Vue {}
</script>
