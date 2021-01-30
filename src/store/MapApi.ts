import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import MapSubmission from '../Models/MapSubmission.Model';

class MapAPIHandler {
    public routes : Map<string, string> = new Map<string, string>();
    
    constructor(){
        this.routes.set("get", "https://kommune.emilostervig.dk/api/v2/?action=getposts");
        this.routes.set("save", "https://kommune.emilostervig.dk/api/v2/?action=save");
        this.routes.set("update", "https://kommune.emilostervig.dk/api/v2/?action=update");
        this.routes.set("getbykey", "https://kommune.emilostervig.dk/api/v2/?action=getedit");
        this.routes.set("createroom", "https://kommune.emilostervig.dk/api/v2/?action=createroom");
        this.routes.set("checkroom", "https://kommune.emilostervig.dk/api/v2/?action=checkroom");
    }
    
    public getPosts(room: string) : Promise<MapSubmission[]> {
        let url = this.routes.get("get");
        if(typeof url == "undefined")
        {
            return new Promise((resolve, reject) => {
                return [];
            })
        }
        url += '&room='+room;
        return axios.get<MapSubmission[]>(url).then((res : any) => {
            if('success' in res.data && res.data.success == false || res.data.length == 0){
                return [];
            }
            let dataArray : MapSubmission[] = res.data.map( (el: any) => {
                return {
                    name: el.name,
                    ID: el.id,
                    entries: el.entries,
                    date: el.date
                }
            })
            return dataArray;
        });
        
    }

    public checkRoom(room : string) : Promise<boolean>{
        let url = this.routes.get("checkroom");
        if(typeof url == "undefined"){
            return new Promise((resolve, reject) => {
                return false;
            })
        }
        
        url += "&room="+room;
        return axios.get(url).then((res : any) => {
            let valid = false;
            if(res.data.success){
                valid = true;
            }
            return valid;
        })
    }
    public getPostByKey(key : string): Promise<MapSubmission|boolean>{
        let url = this.routes.get("getbykey");
        if(typeof url == "undefined"){
            return new Promise((resolve, reject) => {
                return false;
            })
        }
        url += "&key="+key;
        return axios.get(url).then((res) => {
            if(res.data){
                return {
                    post: {
                        name: res.data.name,
                        key: res.data.room_key,
                        date: res.data.created_at,
                        entries: res.data.entries
                    },
                    room: res.data.room_key
                }
            }
            

            return res.data;
        })
    }

    public savePost(name: string, data: string, room: string) : Promise<AxiosResponse> {
        let url = this.routes.get("save");
        let options = new URLSearchParams();
        options.append('name', name);
        options.append('room', room);
        options.append('data', data);
        let headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        if(typeof url == "undefined")
        {
            return new Promise((resolve, reject) => {
                return reject;
            })
        }
        return axios.post(url, options, headers).then(res => res.data);
    }

    public updatePost(key: string, data: string, name: string) : Promise<AxiosResponse>{
        let url = this.routes.get("update");
        let options = new URLSearchParams();
        options.append('name', name);
        options.append('key', key);
        options.append('data', data);
        let headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        if(typeof url == "undefined")
        {
            return new Promise((resolve, reject) => {
                return reject;
            })
        }
        return axios.post(url, options, headers).then(res => res.data);
    }

    public createRoom(room: string){
        let url = this.routes.get("createroom");
        let options = new URLSearchParams();
        options.append('room', room);
        let headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        if(typeof url == "undefined")
        {
            return new Promise((resolve, reject) => {
                return reject;
            })
        }
        return axios.post(url, options, headers).then(res => res.data);;
    }
}

const MapAPI = new MapAPIHandler();
export default MapAPI;