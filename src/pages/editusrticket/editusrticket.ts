import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Ticket } from '../ticket/ticket';
import { Login } from '../login/login';
import { ResponPage } from '../respon/respon';
import { FixedPage } from '../fixed/fixed';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { File } from '@ionic-native/file';

declare var cordova: any;

/**
 * Generated class for the EditUsrTicket page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 
@Component({
  selector: 'page-editusrticket',
  templateUrl: 'editusrticket.html',
})
export class EditUsrTicket {

	userCredential: any;
  userDetails : any;
  dataCoba: any;
  ticket_id : any;
  buttonValue : any;
  private responseData: any;

  statusValue = {
    "status":""
  }

  optionValue = {
    "open":"",
    "respon":"",
    "fixed":"",
    "closed":""
  }


  ticketData = {
  	"subject":"",
  	"category":"",
  	"location":"",
  	"description":"",
  	"user_id":"",
  	"token":"",
    "ticket_id":"",
    "status":"",
    "action" : "",
    "name": "",
    "closed_reason":"",
    "updated_name":"",
    "img_submit":"",
    "img_sub_stat" : "",
    "img_act_stat" : "",
    "img_action": ""
  };

  statuslastImage = {
    "status":"true"
  };

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public toastCtrl:ToastController,
    private file: File
    ) {
  }

  ionViewDidEnter() {
    this.inIt();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  inIt(){
    if (!localStorage.getItem('userData')) {
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }else{
      if (this.navParams.get('ticket_id')) {

        if (this.navParams.get('status')) {
          if (this.navParams.get('status') == 'Closed') {
            this.statusValue.status = "";
            this.optionValue.closed ="true"
          }
          if (this.navParams.get('status') == 'Respon') {
            this.statusValue.status = "true";
            this.optionValue.closed ="true";
            this.optionValue.open ="true";
            this.optionValue.respon ="true";
          }
          if (this.navParams.get('status') == 'Fixed') {
            this.statusValue.status = "true";
            this.optionValue.fixed ="true";
            this.optionValue.closed ="true";
            this.optionValue.open ="true";
          }
          if (this.navParams.get('status') == 'Open') {
            this.statusValue.status = "true";
            this.optionValue.closed ="true";
            this.optionValue.open ="true";
          }
        }

        const data =  JSON.parse(localStorage.getItem('userData'));
        this.userDetails = data.userData;

        this.ticketData.user_id = this.userDetails.user_id;
        this.ticketData.token = this.userDetails.token;
        this.ticketData.ticket_id = this.navParams.get('ticket_id');
        this.ticketData.status = this.navParams.get('status');

        this.authServiceProvider.postData(this.ticketData, "getEditOpen").then((result) =>{
          this.responseData = result;    

          if(this.responseData.ticketOpenData){
            const dataTicket =  this.responseData;
            this.ticketData = dataTicket.ticketOpenData;

            if (dataTicket.ticketOpenData.image_action != "") {
              this.ticketData.img_act_stat = 'true';
              this.ticketData.img_action = "http://219.83.56.90:81/insys/uploaded/api/uploads/"+this.navParams.get('ticket_id')+"/"+dataTicket.ticketOpenData.image_action;
            }

            if (dataTicket.ticketOpenData.image_submit != '') {
              this.ticketData.img_sub_stat = "true";
              this.file.checkFile(cordova.file.externalApplicationStorageDirectory,dataTicket.ticketOpenData.img_submit).then(
                (files) => {
                  this.ticketData.img_submit = cordova.file.externalApplicationStorageDirectory + dataTicket.ticketOpenData.img_submit;
                }
              ).catch(
                (err) => {
                  this.ticketData.img_submit = "http://219.83.56.90:81/insys/uploaded/api/uploads/"+this.navParams.get('ticket_id')+"/"+dataTicket.ticketOpenData.image_submit;
                }
              );
            }
          }else{
            this.presentToast("Connection Problem");
          }
        }, (err) => {
          this.presentToast("Connection Problem");
        });
      }
    }
  }

  updateTicket(){
  	const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.ticketData.user_id = this.userDetails.user_id;
    this.ticketData.token = this.userDetails.token;
    this.ticketData.ticket_id = this.navParams.get('ticket_id');


  	if(this.ticketData.status){
      console.log(this.ticketData);
  		this.authServiceProvider.postData(this.ticketData, "updateUsrTicket").then((result) =>{
	        this.responseData = result;
	        if(this.responseData.success){
	          if (this.navParams.get('status') == 'Open') {
              this.navCtrl.push(Ticket);
            }
            if (this.navParams.get('status') == 'Respon') {
              this.navCtrl.push(ResponPage);
            }
            if (this.navParams.get('status') == 'Fixed') {
              this.navCtrl.push(FixedPage);
            }
	        }else{
	          this. presentToast("Give valid details");
	        }
	    }, (err) => {
	        this.presentToast("Connection Problem");
	    });
  	}else{
  	  	this.presentToast("Fill the Blank");
  	}
  }

}
