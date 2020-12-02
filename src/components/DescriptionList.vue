<template>
    <div class="description-list">
        <h2 class="description-list__heading">
            Beskriv kort dine overnatninger
        </h2>
        <div class="description-list__item" v-for="item in visitedMunicipalities()" :key="'description-list__item_'+item.name">
            <div class="description-list__item-heading">

                <h4 class="description-list__item-name">
                    {{item.displayName}}
                </h4>
                <span class="description-list__remove-item button button--small button--primary" v-on:click="removeFromList(item)">
                    Fjern
                </span>
            </div>
            <textarea class="description-list__textarea" v-model="item.description" required>
            </textarea>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../store/MapApi';
import MapDataObject from '../Models/MapDataObject.Model';
import Pluralizer from '../Helpers/Pluralizer';
import MapSubmission from '../Models/MapSubmission.Model';

@Component
export default class DescriptionList extends Vue {
    @Prop() private name!: string;

    private nameField : string = this.name;
 
    visitedMunicipalities(){
        let posts = [...this.$store.getters.getVisitedMapData];
        return posts;
        return posts.sort( (a : MapSubmission, b : MapSubmission) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'da')
        });
    }

    removeFromList(item : MapDataObject){
        item.visited = false;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">    

</style>
