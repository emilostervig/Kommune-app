<template>
    <header class="headline-block" :class="getBlockClasses()">
        <tag :is="headingType" class="headline-block__headline" v-if="hasHeadline()">
            <slot name="headline"></slot>
        </tag>
        <h3 class="headline-block__subheadline" v-if="hasSubHeadline()">
            <slot name="subheadline"></slot>
        </h3>
    </header>

  
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../store/MapApi';
import MapDataObject from '../Models/MapDataObject.Model';

@Component({
  components: {
  },
})
export default class HeaderBlock extends Vue {
    @Prop({default : 'h1'}) 
    headingType : string;

    @Prop({
        default : function(){
            return [];
        }
    }) 
    classList : string[];

    @Prop({default : 'center'}) 
    align : string;
    mounted(){
        
    }

    getBlockClasses(){
        let alignClass = "headline-block--text-"+this.align;
        let returnArray = [...this.classList]
        returnArray.push(alignClass);
        return returnArray;
    }

    hasHeadline() {
        return this.$slots.headline;
    }

    hasSubHeadline() {
        return this.$slots.subheadline;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    
    
    
    

</style>
