<template>
    
    <div class="loading-spinner" :class="elementClass()" :style="cssVars()">
        <div class="loading-spinner__ring"><div></div><div></div><div></div><div></div></div>
    </div>
  
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {
    @Prop({
        default: '60px'
    }) 
    size : string;

    @Prop() classList : string;
    mounted(){
    }

    elementClass(){
        return [
            this.classList
        ]
    }
    cssVars() {
        return {
            '--size': this.size,
        }
    }
  

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 

    
    
  

</style>
