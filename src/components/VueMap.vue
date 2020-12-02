<template>
<div>
    <div class="notice-message notice-message--info edit-link-message" v-if="mapKey">
        <p>for at redigere din indtastning skal du bruge følgende link: <a :href="getEditLink()">{{getEditLink()}}</a></p>
    </div>
    <div class="vue-map" v-if="mapDataLoaded">
        <form class="map-form">
            <div class=" flex-row flex-row--ai-top flex-row--jc-center">
                <SvgMap :mapData="mapData" v-on:clicked="onMunicipalityClick($event)"></SvgMap>
                <MapForm v-on:submitted="onFormSubmit($event)" v-on:clear="clearAll()" v-model="name" :name="name"></MapForm>
            </div>
            <DescriptionList>
                
            </DescriptionList>
        </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../Store/MapApi';
import MapDataObject from '../Models/MapDataObject.Model';
import MapForm from '../Components/MapForm.vue';
import SvgMap from '../Components/SvgMap.vue';
import DescriptionList from '../Components/DescriptionList.vue';
interface MapFormSubmit {
    name: string
}
@Component({
  components: {
    MapForm,
    SvgMap,
    DescriptionList
  },
})
export default class VueMap extends Vue {
    @Prop() private mapKey!: string;

    private showToolTip : Boolean = false;
    private mapDataLoaded : boolean = false;
    private queryString : string = "";
    private name : string = "";
    private isEdit : boolean = false;
    mounted(){
        
        if(this.mapKey){
            this.setupEdit();
        } else{
            this.mapDataLoaded = true;
        }
        
    }
    get mapData() : MapDataObject[] {
        return this.$store.getters.getMapData;
    }
    setupEdit(){
        this.isEdit = true;
        MapAPI.getPostByKey(this.mapKey).then( ( el : any ) => {
            if(typeof el == "object" && "post" in el){
                this.name = el.post.name;
                this.$store.dispatch('setRoom', el.room);
                let mapKeys = [...el.post.entries];
                for (let index = 0; index < mapKeys.length; index++) {
                    const currentKey = mapKeys[index];
                    let municipality = this.mapData.find( (el => {
                        return el.name == currentKey.municipality;  
                    }))
                    if(municipality){
                        municipality.visited = true;
                        municipality.description = currentKey.description;
                    }
                    
                }
            }
            this.mapDataLoaded = true;
        })
    };
    getEditLink(){
        let pathWORes   = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
        let protoWDom   = location.href.substr(0, location.href.indexOf("/", 8));
        let urlBase     = protoWDom + pathWORes;
        return urlBase + '#/edit/'+this.mapKey;
    }
    clearSearch(){
        this.queryString = "";
    }
    filteredList(){
        if(this.queryString.length == 0){
            return this.mapData;
        }
        return [...this.mapData].filter( (el) => {
            return el.displayName.toLowerCase().indexOf(this.queryString.toLowerCase()) != -1;
        })
    }
    countMunicipalities() {
        return this.visitedMunicipalities().length;
    }
    visitedMunicipalities(){
        return this.mapData.filter(el => el.visited == true);
    }
    onMunicipalityClick(data: object) : void {
        this.$store.dispatch("updateMapDataVisited", data);
    }
    pluralizer(count : number, singular : string, plural : string){
        if(count == 1){
            return singular;
        } 
        return plural;
    }

    clearAll(){
        this.$store.dispatch('clearAllVisitied');
    }


    onFormSubmit(formData : MapFormSubmit) : void {
        let name = formData.name;
        let data = this.mapData.filter(el => el.visited);
        let key = this.mapKey;
        let entryArray : {[k: string]: any}[] = [];
        let obj: {[k: string]: any} = {};
		data.forEach((value, key) => {
            entryArray.push({
                name: value.name,
                description : value.description
            });
        });
        let postObj = JSON.stringify(entryArray);
        
        if(this.isEdit){
            MapAPI.updatePost(key, postObj, name).then(response => {
                console.log(response)
            })
        } else{
            let room = this.$store.getters.getRoom;
            if(!room){
                return;
            }
            MapAPI.savePost(name, postObj, room).then( (response: any) => {
                if("success" in response && "key" in response){
                    this.$emit('savepost', response.key);
                    this.$router.push({ name: 'Edit', params: { key: response.key }});
                }
            })
        }
        return;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    

</style>
