

require('./bootstrap');

window.Vue = require('vue');

import Vue from 'vue';
//para auto-scroll
import VueChatScroll from 'vue-chat-scroll';
Vue.use(VueChatScroll);
// para notificaciones
import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000});

Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data:{
    	message:'',
    	chat:{
    		messages:[],
            user:[],
            color:[],
            time:[]
    	},
        escribiendo:'',
        numeroDeUsuarios:0
    },
    watch:{
        message(){
            Echo.private('chat')
                .whisper('escribiendo',{
                    message: this.message
                });
        }
    },
    methods:{
    	send(){
    		if(this.message.length != 0){
    			this.chat.messages.push(this.message);
                this.chat.user.push('tu');
                this.chat.color.push('success');
                this.chat.time.push(this.getTime());
                axios.post('/send', {
                    message: this.message,
                    chat: this.chat,
                })
                .then(response => {
                    this.message='';
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        getTime(){
            let time=new Date();
            return time.getHours()+':'+time.getMinutes();
        },
        getOldMessage(){
            axios.post('/getOldMessage')
                .then(response =>{
                    if(response.data!=''){
                        this.chat = response.data;
                    }
                })
                .catch(error =>{
                    console.log(error);
                });
        },
        deleteSession(){
            axios.post('/deleteSession')
                .then(response =>{
                    this.$toaster.success('Historial de chat eliminado de la session');
                });
        }
    },
    mounted(){
        this.getOldMessage();
        Echo.private('chat')
            .listen('ChatEvent', (e)=>{
                this.chat.messages.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push('warning');
                this.chat.time.push(this.getTime());
                axios.post('/saveToSession',{
                    chat:this.chat,
                })
                    .then(response =>{
                        
                    })
                    .catch(error =>{
                        console.log(error);
                    }); 
            })
            .listenForWhisper('escribiendo', (e)=>{
                if(e.message != ''){
                    this.escribiendo='Escribiendo...';
                }else{
                    this.escribiendo='';
                }
            });
        Echo.join('chat')
            .here((users) => {
                this.numeroDeUsuarios = users.length;
            })
            .joining((user) => {
                this.numeroDeUsuarios += 1;
                this.$toaster.success(user.name+' ha ingesado al chat');
            })
            .leaving((user) => {
                this.numeroDeUsuarios -= 1;
                this.$toaster.warning(user.name+' ha dejado el chat');
            });
            }
});