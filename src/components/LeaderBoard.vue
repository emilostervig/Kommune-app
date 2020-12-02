<template>
    
    <div class="leader-board">
        <transition name="fade-quick" mode="out-in">
            <Loader v-if="!postsLoaded" size="90px"></Loader>
            <div v-if="postsLoaded" class="leader-board__list">
                <table class="leader-board__table">
                    <tr class="leader-board__table-heading">
                        <th v-on:click="setOrderby('name')">
                            Navn
                            <span v-show="orderBy == 'name'" class="leader-board__order-icon" :class="{ 'leader-board__order-icon--asc' : this.orderASC, 'leader-board__order-icon--desc' : !this.orderASC}">
                            </span>
                        </th>

                        <th v-on:click="setOrderby('count')">
                            Kommuner
                            <span v-show="orderBy == 'count'" class="leader-board__order-icon" :class="{ 'leader-board__order-icon--asc' : this.orderASC, 'leader-board__order-icon--desc' : !this.orderASC}">
                            </span>
                        </th>
                    </tr>

                    <tr class="leader-board__list-item" v-for="item in getOrderedPosts()" v-bind:key="item.ID">
                        
                        <td>
                            {{item.name}}
                        </td>
                        
                        <td>
                            {{ countSubmission(item) }}
                        </td> 
                    </tr>

                </table>

            </div>
        </transition>   
    </div>
  
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../Store/MapApi';
import MapSubmission from '../Models/MapSubmission.Model';
import Loader from '../Components/Loader.vue';

@Component({
    components: {
        Loader,
    }
})
export default class Leaderboard extends Vue {
    private postsLoaded : boolean = false;
    private posts : MapSubmission[] = [];
    private orderBy : string = "count";
    private orderASC : boolean = false;
    mounted(){
        
        this.getPosts();
        
    }

    getPosts() : void {
        let room = this.$store.getters.getRoom;
        let posts = MapAPI.getPosts(room).then(posts => {
            this.posts = posts;
            this.postsLoaded = true;

        });
    }
    setOrderby(orderBy: string){
        if(this.orderBy == orderBy){
            this.orderASC = !this.orderASC; 
        }
        this.orderBy = orderBy;
    }
    countSubmission(instance: MapSubmission) : number {
        return instance.entries.filter(el => el.visited).length;
    }
    postListByMunicipality() : MapSubmission[]{
        return [...this.posts].sort( (a,b) => {
            return this.countSubmission(b) - this.countSubmission(a);
        })
    }
    postListByName() : MapSubmission[]{
        let posts = [...this.posts];
        return posts.sort( (a : MapSubmission, b : MapSubmission) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'da')
        });
    }
    getOrderedPosts(){
        let posts = [...this.posts];
        switch (this.orderBy) {
            case "count":
                posts = this.postListByMunicipality();
                break;
            case "name":
                posts = this.postListByName();
                break;
            default:
                ;
        }
        if(this.orderASC == true){
            return [...posts].reverse();
        }
        return [...posts];
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    
    
    
  

</style>
