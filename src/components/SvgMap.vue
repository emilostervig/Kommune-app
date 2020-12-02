<template>
    <div class="svg-map" v-if="mapData.length">
        <svg viewBox="0 0 540 650" class="svg-map__svg"> 
            <path class="svg-map__municipality" 
                v-for="municipality in mapData" 
                :d="municipality.path" 
                :class="{'svg-map__municipality--visited': municipality.visited}" 
                v-bind:key="municipality.name" 
                v-on:click="onMunicipalityClick(municipality.name, municipality.visited)" 
                v-on:mouseenter="onMouseEnter($event, municipality.displayName)"
                v-on:mouseleave="onMouseLeave($event)">
                >
            </path>
            <path class="svg-map__outline" d="M 412,21 L 482,21 L 482,101 L 412,101 z  M 386,142 L 529,142 L 529,319 L 386,319 z"></path>
        </svg>
            <div class="svg-map__municipality-name" v-show="showToolTip" ref="tooltipEl" :style="tooltipStyle()">
                {{toolTipString}}
            </div>
    </div>

  
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../store/MapApi';
import MapDataObject from '../Models/MapDataObject.Model';
import { Debounce, Throttle } from '../Helpers/Debounce';

@Component({
  components: {
  },
})
export default class SvgMap extends Vue {
    @Prop() mapData : MapDataObject[];

    private showToolTip : Boolean = false;
    private toolTipString: string = '';
    private cordY : number = 0;
    private cordX : number = 0;
    public $refs: {
        tooltipEl: HTMLElement
    };
    private debounceCall: any;
    mounted(){
        this.debounceCall = Throttle(this.mouseIsMoving, 25);
        window.addEventListener('mousemove',this.debounceCall);
    }
    
    destroyed() {
        window.removeEventListener('mousemove', this.debounceCall);
    }

    tooltipStyle(){
        return {
            left: this.cordX+"px",
            top: this.cordY+"px"
        }
    }
    mouseIsMoving($event : MouseEvent){
        this.cordY = $event.pageY;
        this.cordX = $event.pageX;
    }
    onMunicipalityClick(name: string, currentValue: boolean) : void {
        let visited = (currentValue == true) ? false : true;
        this.$emit("clicked", {name, visited})
    }
    onMouseEnter($event: { target: HTMLElement; }, name: string){
        this.showToolTip = true;
        this.toolTipString = name;
    }
    onMouseLeave($event: Event){
        this.showToolTip = false;
        this.toolTipString = '';
        return;
    }



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    

    

</style>
