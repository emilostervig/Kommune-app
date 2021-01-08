<template>
    <div class="map-form__check-list">
        <div class="map-form__search">
            <div class="map-form__search-input-wrap">
                <input type="search" name="municipality_search" class="map-form__search-input" v-model="queryString" placeholder="Søg efter kommune...">
                <span v-if="queryString.length" class="map-form__search-close" v-on:click="clearSearch()">

                </span>
            </div>
        </div>
        <div class="map-form__check-list-container">
            <div v-if="filteredList().length" class="map-form__check-list-results">

                <div v-for="municipality in filteredList()" class="map-form__check-item" :class="{'active' : municipality.visited}" v-bind:key="municipality.name">
                    <label>
                        <input type="checkbox" v-model="municipality.visited" :name="'municipality_check_'+municipality.name">
                        <span class="map-form__check-item-name no-selection" v-on:click="clearSearch()" >
                            {{municipality.displayName}}
                        </span>
                    </label>
                </div>
            </div>
            <div class="map-form__check-list-no-results" v-else>
                Ingen resultater for <i>{{queryString}}</i>
            </div>
        </div>
        <div class="map-form__resume-list-wrapper">
            <h3 class="map-form__resume-list-heading">
                Du har sovet i {{ countMunicipalities() }} {{ pluralizer(countMunicipalities(), 'kommune', 'kommuner') }}
            </h3>
            <button class="button button--primary" v-on:click="clearAll()">
                Ryd valgte
            </button>
            <div v-if="false" class="map-form__resume-list">
                <div class="map-form__resume-list-item" v-for="muni in visitedMunicipalities()" v-bind:key="muni.name">
                    {{muni.displayName}}
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="name_input" class="form-group__label">
                Navn:
            </label>
            <input id="name_input" type="text" required v-model="nameField" class="form-group__input" v-on:input="$emit('input', nameField)">    
        </div>
        <button type="submit" class="button button--primary" v-on:click="savePost($event)">
            GEM
        </button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../Store/MapApi';
import MapDataObject from '../Models/MapDataObject.Model';
import Pluralizer from '../Helpers/Pluralizer';

@Component
export default class MapForm extends Vue {
    @Prop() private name!: string;

    private queryString : string = "";
    private nameField : string = this.name;
    private mapData : MapDataObject[] = this.$store.getters.getMapData;
 
    clearSearch(){
        this.queryString = "";
    }
    countMunicipalities() {
        return this.visitedMunicipalities().length;
    }
    visitedMunicipalities(){
        return this.$store.getters.getVisitedMapData;
    }
    getMapData() {
        return this.$store.getters.getMapData;
    }
    disabledButton(){
        let disabled = false;
        if(this.visitedMunicipalities().length == 0){
            disabled = true;
        }
        if(this.nameField.length == 0){
            disabled = true;
        }
        return disabled;
    };
    filteredList(){
        if(this.queryString.length == 0){
            return this.getMapData();
        }
        return [...this.getMapData()].filter( (el) => {
            return el.displayName.toLowerCase().indexOf(this.queryString.toLowerCase()) != -1;
        })
    }
    pluralizer(count:number, singular: string, plural: string){
        return Pluralizer(count, singular, plural);
    }
    
    clearAll(){
        this.$emit('clear');
    }

    savePost($event: Event) {
        this.$emit('submitted', {name: this.nameField});
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">    

</style>
