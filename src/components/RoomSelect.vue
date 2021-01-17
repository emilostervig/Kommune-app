<template>
    <div class="room-picker" >
        <div class="room-select">
            <HeaderBlock>
                <template v-slot:headline>
                    Vælg en gruppe
                </template>
                <template v-slot:subheadline>
                    Indtast eksisterende gruppe navn eller opret en ny gruppe
                </template>
            </HeaderBlock>
            <div class="room-select__form-widget">
                <transition name="fade-quick" mode="out-in">
                    <form class="room-select__form room-select__form--enter" v-on:submit="enterRoom($event)" v-if="!showCreateRoom" key="join-room-form">
                        <h2 class="text-center">Deltag i gruppe</h2>
                        <div class="room-select__join-room" >
                            <input class="room-select__input" required type="text" name="create_roomtext" v-model="roomText" placeholder="indtast gruppe navn..." v-on:input="onFieldInput()" key="join-room-name">
                            <button type="submit" class="room-select__submit button--primary">
                                Vælg gruppe
                                <transition name="fade-quick">
                                    <Loader size="20px" class="room-select__button-loader" v-if="isLoading">
                                    </Loader>
                                </transition>
                            </button>
                        </div>
                        <div class="room-select__or-message text-center">
                            Eller
                        </div>
                        <div class="room-select__switch-room  button button--ghost" v-on:click="changeForm">
                            Opret en ny gruppe
                        </div>
                    </form>
                    <form class="room-select__form room-select__form--create" v-on:submit="createRoom($event)" v-if="showCreateRoom" key="create-room-form">
                        <h2 class="text-center">Opret ny gruppe</h2>
                        <div class="room-select__create-room" >
                            <input class="room-select__input" required type="text" name="create_roomtext" v-model="createRoomText" placeholder="indtast gruppe navn..." v-on:input="onFieldInput()" key="create-room-name"> 
                            <button type="submit" class="room-select__submit button--primary">
                                Opret gruppe
                                <transition name="fade-quick">
                                    <Loader size="20px" class="room-select__button-loader" v-if="isLoading">
                                    </Loader>
                                </transition>
                            </button>
                        </div>
                        <div class="room-select__or-message text-center">
                            Eller
                        </div>
                        <div class="room-select__switch-room button button--ghost" v-on:click="changeForm()">
                            Deltag i eksisterende gruppe
                        </div>
                    </form>
                </transition>
                <transition name="fade">
                    <div class="notice-message notice-message--error" v-if="showError">
                        {{ this.errorMessage }}
                    </div>
                </transition>
            </div>
        </div> 
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapAPI from '../Store/MapApi';
import MapDataObject from '../Models/MapDataObject.Model';
import HeaderBlock from '../Components/HeaderBlock.vue';
import Loader from '../Components/Loader.vue';

@Component({
  components: {
      HeaderBlock,
      Loader
  },
})
export default class RoomSelect extends Vue {
    private showCreateRoom : boolean = false;
    private roomText : string = "";
    private createRoomText : string = "";
    private errorMessage : string = "";
    private showError : boolean = false;
    private isLoading : boolean = false;
    mounted(){
        
    }
    
    changeForm(){
        this.showError = false;
        this.showCreateRoom = !this.showCreateRoom;
    }
    enterRoom($event : Event){
        this.showError = false;
        this.isLoading = true;
        $event.preventDefault();
        MapAPI.checkRoom(this.roomText).then((res: any) => {
            if(res == true){
                this.$emit('pickroom', this.roomText);
            } else{
                this.errorMessage = "Gruppen findes ikke";
                this.showError = true;
            }
            this.isLoading = false;
        })
    }

    createRoom($event : Event){
        this.showError = false;
        this.isLoading = true;
        $event.preventDefault();
        MapAPI.createRoom(this.createRoomText).then(( res : any ) => {
            if('success' in res && res.success == true){
                this.$emit('pickroom', res.room)
            }

            if('success' in res && res.success != true){
                this.errorMessage = res.message;
                this.showError = true;
            }
            this.isLoading = false;
        })
    }
    onFieldInput(){
        this.roomText = this.filterInput(this.roomText);
        this.createRoomText = this.filterInput(this.createRoomText);
    }
    filterInput(text: string){
        const regex = /(\s|\W|[^a-zA-z0-9])/gmiu;
        const subst = ``;
        const result = text.replace(regex, subst);
        return result.toLowerCase();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    

    

</style>
