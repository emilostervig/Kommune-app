<template>
<div>
    <div class="notice-message notice-message--info edit-link-message" v-if="mapKey">
        <p>for at redigere din indtastning skal du bruge følgende link: <a :href="getEditLink()">{{getEditLink()}}</a></p>
    </div>
    <div class="vue-map" v-if="mapDataLoaded">
        <form class="map-form" ref="formRef" @submit.prevent="onFormSubmit($event)">
            <div class=" flex-row flex-row--ai-top flex-row--jc-center">
                <SvgMap :mapData="mapData" v-on:clicked="onMunicipalityClick($event)"></SvgMap>
                <MapForm 
                    v-on:submitted="onNameSubmitted($event)" 
                    v-on:clear="clearAll()" 
                    v-model="name" 
                    :name="name"
                    :success-messages="successMessages"
                    :error-messages="errorMessages">

                </MapForm>
            </div>
            <DescriptionList v-if="visitedMunicipalities().length">
                
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
    public $refs: {
        formRef: HTMLFormElement
    };
    @Prop() private mapKey!: string;

    private showToolTip : Boolean = false;
    private mapDataLoaded : boolean = false;
    private queryString : string = "";
    private name : string = "";
    private isEdit : boolean = false;

    private successMessages: string[] = [];
    private errorMessages: string[] = [];

    private successTimeout: number;
    private errorTimeout: number;

    mounted(){
        
        if(this.mapKey){
            this.setupEdit();
        } else{
            this.setupNew();
            this.mapDataLoaded = true;
        }
        
    }
    get mapData() : MapDataObject[] {
        return this.$store.getters.getMapData;
    }

    setupNew() {
        this.clearAll();
    }
    setupEdit(){
        this.isEdit = true;
        if(this.$route.query.firstSave){
            this.promptSaveNotice();
            this.$router.push({ query: {} })
        }
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

    promptSaveNotice(): void {
        
        clearTimeout(this.successTimeout);
        this.successMessages = [];
        this.successMessages.push( "Din indtastning blev gemt" );
        this.successTimeout = setTimeout( () => {
            this.successMessages = [];
        }, 3000);
    }

    promptErrorNotice(): void {
        clearTimeout(this.errorTimeout);
        this.errorMessages = [];
        this.errorMessages.push( "Din indtastning blev gemt" );
        this.successTimeout = setTimeout( () => {
            this.errorMessages = [];
        }, 3000);
    }


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

    onNameSubmitted(formData : MapFormSubmit) {
        this.name = formData.name;
    }

    saveLocal(key: string, data: any) {
        let jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
    }
    getLocal(key: string){
        let storageData = localStorage.getItem(key);
        if(storageData == null){
            return false;
        }
        return JSON.parse(storageData);
    }
    saveLocalEditKey(savekey: string){
        let storageData = this.getLocal('savekeys');
        if(!storageData){
            storageData = [];
        }
        storageData.push(savekey);
        this.saveLocal('savekeys',storageData);
    }

    onFormSubmit($event: Event) : void {
        let name = this.name;
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
                this.promptSaveNotice();
            })
        } else{
            let room = this.$store.getters.getRoom;
            if(!room){
                return;
            }
            MapAPI.savePost(name, postObj, room).then( (response: any) => {
                if("success" in response && "key" in response){
                    this.$emit('savepost', response.key);
                    this.saveLocalEditKey(response.key);
                    this.$router.push({ 
                        name: 'Edit', 
                        params: { key: response.key }, 
                        query: { firstSave: "true" }
                    });

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
