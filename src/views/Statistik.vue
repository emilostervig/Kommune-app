<template>
  <div class="statistics">
    
    <HeaderBlock>
      <template v-slot:headline>
        Statistik
      </template>
      <template v-slot:subheadline>
        Se hvem der fører
      </template>
    </HeaderBlock>
    <LeaderBoard>
    </LeaderBoard>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeaderBoard from '../Components/LeaderBoard.vue';
import MapSubmission from '../Models/MapSubmission.Model';
import HeaderBlock from '../Components/HeaderBlock.vue';
import MapAPI from '../Store/MapApi';
@Component({
  components: {
    LeaderBoard,
    HeaderBlock,
  },
})
export default class Statistik extends Vue {
}
</script>
