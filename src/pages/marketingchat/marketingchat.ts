import { Component, ViewChild, NgZone } from '@angular/core';
import * as io from 'socket.io-client';
import { NavController, NavParams, Content } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the MarketingchatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-marketingchat',
  templateUrl: 'marketingchat.html',
})
export class MarketingchatPage {
	@ViewChild(Content) content : Content;
	param = {
		"user_chat":"",
		"user_id":"",
		"token":"",
		"level":"",
    "book_id":"",
		"profile_image":"assets/img/chatterplace.png",
    "note":"",
    "status":"",
    "status_cek":""
	}

  online = {
    "book_id":"",
    "status":"" ,
    "status_cek":"",
    "user_id":""
  }
  
	dataResponse : any;
  responseData: any;

  messages:any = [] ;
  sockethost: string = "http://219.83.56.90:3000/";
  socket:any;
  chat:any;
  userid:string;
  zone:any;
  
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider
  ) {
    this.inIt();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarketingchatPage');
  }

  addmessage() {
    const data =  JSON.parse(localStorage.getItem('userData'));

    this.param.book_id = this.navParams.get('book_id');
    this.param.user_id = data.userData.user_id;
    this.param.token = data.userData.token;

    this.authServiceProvider.postData(this.param, "addChatMarketing").then((result) =>{
      this.dataResponse = result;

      this.socket.emit('new message',this.dataResponse.chatData)
      this.param.note = "";

      this.content.scrollToBottom();
    },(err)=>{

    })   
  }

  ionViewDidEnter() {
    this.getChatMarketing();
  }

  getChatMarketing() { 
    const data =  JSON.parse(localStorage.getItem('userData'));

    this.param.book_id = this.navParams.get('book_id');
    this.param.user_id = data.userData.user_id;
    this.param.token = data.userData.token;
    this.param.level = data.userData.level;
    
    this.authServiceProvider.postData(this.param, "getChatMarketing").then((result) =>{
      this.responseData = result;  

      this.messages = this.responseData.chatData;
      
    },(err)=>{

    })
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  ionViewDidLeave(){
    const data =  JSON.parse(localStorage.getItem('userData'));
    
    this.online.book_id = this.navParams.get('book_id').toString();
    this.online.user_id = data.userData.user_id.toString();

    this.authServiceProvider.postData(this.online, "setOffline").then((result) =>{
      console.log();
      this.socket.emit('user offline',this.online)
    }, (err)=>{
      console.log("error");
    })
  }

  inIt(){
  	const data =  JSON.parse(localStorage.getItem('userData'));

  	this.param.user_id = data.userData.user_id.toString();
  	this.param.token = data.userData.token;
    this.param.level = data.userData.level;
    this.param.book_id = this.navParams.get('book_id');

    if (this.param.level == 'admin') {
      //console.log(this.param);
      this.authServiceProvider.postData(this.param, "getAdminChat").then((result) =>{
        this.dataResponse = result;

        this.param.user_chat = this.dataResponse.getUserChat.name      
        if (this.dataResponse.getUserChat.profile_image == '') {
          this.param.profile_image = "assets/img/chatterplace.png";
        }else{
          this.param.profile_image = "http://219.83.56.90:81/InSys/uploaded/api/profile/"+this.dataResponse.getUserChat.user_id+"/"+this.dataResponse.getUserChat.profile_image;
        }
        this.scrollto();
        this.socket = io.connect(this.sockethost);
        this.zone = new NgZone({enableLongStackTrace: false});

        this.online.book_id = this.navParams.get('book_id').toString();
        this.online.user_id = data.userData.user_id.toString();
        if (this.dataResponse.getUserChat.online == 1) {
          this.online.status = 'Online';
        }else{
          this.online.status = '';
        }

        this.socket.emit('user online',this.online)
        this.socket.on("user online",(msg)=>{
          this.zone.run(()=>{
            if (this.online.book_id === msg.book_id && this.param.user_id !== msg.user_id) {
              this.online.status = 'Online';
            }
          })
        })

        this.socket.on("user offline",(msg)=>{
          this.zone.run(()=>{
            if (this.online.book_id === msg.book_id && this.param.user_id !== msg.user_id) {
              this.online.status = '';
            }
          })
        })

        this.socket.on("chat message",(msg)=>{
          this.zone.run(()=>{
            if (this.param.book_id == msg.book_id) {
              this.messages.push(msg);
              this.content.scrollToBottom();
            }
          })
        })
      }, (err) =>{

      })
    }else{
    	this.authServiceProvider.postData(this.param, "getUserChat").then((result) =>{
    		this.dataResponse = result;
  			this.param.user_chat = this.dataResponse.getUserChat.name


  			if (this.dataResponse.getUserChat.profile_image == '') {
          this.param.profile_image = "assets/img/chatterplace.png";
        }else{
          this.param.profile_image = "http://219.83.56.90:81/InSys/uploaded/api/profile/"+this.dataResponse.getUserChat.user_id+"/"+this.dataResponse.getUserChat.profile_image;
        }
        this.scrollto();
        this.socket = io.connect(this.sockethost);
        this.zone = new NgZone({enableLongStackTrace: false});

        this.online.book_id = this.navParams.get('book_id').toString();
        this.online.user_id = data.userData.user_id.toString();
        if (this.dataResponse.getUserChat.online == 1) {
          this.online.status = 'Online';
        }else{
          this.online.status = '';
        }

        this.socket.emit('user online',this.online)
        this.socket.on("user online",(msg)=>{
          this.zone.run(()=>{
            if (this.online.book_id === msg.book_id && this.param.user_id !== msg.user_id) {
              this.online.status = 'Online';
            }
          })
        })

        this.socket.on("user offline",(msg)=>{
          this.zone.run(()=>{
            if (this.online.book_id === msg.book_id && this.param.user_id !== msg.user_id) {
              this.online.status = '';
            }
          })
        })

        this.socket.on("chat message",(msg)=>{
          this.zone.run(()=>{
            if (this.param.book_id == msg.book_id) {
              this.messages.push(msg);
              this.content.scrollToBottom();
            }
          })
        })
    	}, (err) =>{

    	})
    }

  }

}