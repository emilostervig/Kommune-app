<template>
    
    <div class="leader-board">
        <transition name="fade-quick" mode="out-in">
            <Loader v-if="!postsLoaded" size="90px"></Loader>
            <div v-if="postsLoaded" class="leader-board__list">

                <h2 class="text-center" v-if="!posts.length">
                    Ingen indtastninger i denne gruppe
                </h2>

                <table class="leader-board__table" v-if="posts.length">
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
                            <div class="flex-row flex-row--ai-center flex-row--jc-between">
                                <span class="leader-board__list-item__count">
                                    <span class="leader-board__list-item__count__badge" :class="getBadgeClass(item)">
                                        {{ countSubmission(item) }}
                                    </span>
                                </span>


                                <span class="leader-board__list-item__show-entry" v-on:click="showSubmission(item)">
                                    <span class="button button--primary button--small button--round">Vis</span>
                                </span>
                            </div>
                        </td> 
                    </tr>
                </table>

            </div>
        </transition>
        <transition name="fade-quick">   
            <div v-if="showingSubmission && showSubmissionMap" class="inspect-submission" v-on:click="handleOverlayClick($event.target)" ref="submissionOverlay">
                <div class="inspect-submission__box">
                    <div class="inspect-submission__overflow">
                      <span class="inspect-submission__close" v-on:click="closeSubmission"></span>
                      <div class="flex-row flex-row--jc-center flex-row--wrap inspect-submission__row">
                          <SvgMap :mapData="showSubmissionMap">
                          </SvgMap>

                          <div class="user-data">
                              <h3 class="user-data__name">
                                  Indtastning for <strong>{{ showSubmissionUser.name}}</strong>
                              </h3>
                              <div class="user-data-list" v-if="showSubmissionUser.entries.length">
                                  <div class="user-data-list-item" v-for="entry in this.submissionVisitedList()" :key="entry.ID">
                                      <h4 class="user-data-list-item__municipality">
                                          {{entry.displayName}}
                                      </h4>
                                      <p class="user-data-list-item__description">
                                          {{entry.description}}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
                </div>

            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../Store/MapApi';
import MapSubmission from '../Models/MapSubmission.Model';
import Loader from '../Components/Loader.vue';
import SvgMap from '../Components/SvgMap.vue';
import MapDataObject from '@/Models/MapDataObject.Model';

@Component({
    components: {
        Loader,
        SvgMap
    }
})
export default class Leaderboard extends Vue {
    private postsLoaded : boolean = false;
    private posts : MapSubmission[] = [];
    private orderBy : string = "count";
    private orderASC : boolean = false;
    private showingSubmission : boolean = false;
    private showSubmissionMap : MapDataObject[];
    private showSubmissionUser : MapSubmission;

    public $refs: {
        submissionOverlay: HTMLElement
    };
    mounted(){
        
        this.getPosts();
        
    }

    get mapData() : MapDataObject[] {
        return this.$store.getters.getCleanMapData;
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

    getBadgeClass(submission: MapSubmission ) : string {
        let count = submission.entries.length;
        let leaderboardList = this.postListByMunicipality().map(el => el.entries.length);
        let top3numbers = leaderboardList.filter( ( value, index, self ) => {
            return self.indexOf(value) === index;
        }).slice(0,3);

        if(count == top3numbers[0]){
            return "gold";
        } else if(count == top3numbers[1]){
            return "silver";
        } else if(count == top3numbers[2]){
            return "bronze";
        } else{
            return "normal";
        }

    }

    handleOverlayClick(target : Node) {
        const overlay = this.$refs.submissionOverlay;
        if(target == null || overlay == null){
            return;
        }
        if(overlay.isSameNode(target)){
            this.closeSubmission();
        };
    }

    submissionVisitedList(){
        return this.showSubmissionMap.filter(el => el.visited);
    }

    closeSubmission() : void {
        this.showSubmissionMap = [];
        this.showingSubmission = false;
        return;
    }

    
    showSubmission(userEntryData : MapSubmission) {
        //this.showSubmissionMap = userEntryData
        this.showingSubmission = true;
        let mapData = [...this.mapData];
        if (userEntryData.entries.length){

            mapData = mapData.map(mapDataEntry => {
                let userDataEl = userEntryData.entries.find(el => el.municipality == mapDataEntry.name);
                if(userDataEl){
                    return {...mapDataEntry, ...userDataEl}
                }
                return {...mapDataEntry}
            })

        }
        this.showSubmissionMap = [...mapData];
        this.showSubmissionUser = userEntryData;
        
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    
    
    
  

</style>
