import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController,PopoverController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';
import { Addticket } from '../addticket/addticket';
import { Createticket } from '../createticket/createticket';
import { EditUsrTicket } from '../editusrticket/editusrticket';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the OpenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 declare var cordova: any;

@Component({
  selector: 'page-open',
  templateUrl: 'open.html',
})
export class OpenPage {

  public userDetails: any;
  public items : any = [];
  public responseData: any;
  public inItData: any;
  public isAdmin   = "";

  public statButton = {
    "respon" : "",
    "fixed" : "",
    "closed" :""
  }

  ticketData = {
    "subject":"",
    "category":"",
    "location":"",
    "description":"",
    "user_id":"",
    "token":"",
    "ticket_id":""
  };

  userTicketData = {
    "user_id":"",
    "token":"", 
    "ticket_id":"",
    "level":"",
    "closed_reason" : "",
    "action_reason":"",
    "category":""
  };

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public commonProvider: CommonProvider,
    private alertController: AlertController,
  	public toastCtrl:ToastController,
    public popoverCtrl: PopoverController
  ) {
    
  }

  ionViewDidEnter() {
    this.getTicketOpen();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  showSetting(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  chgPage(){
    this.navCtrl.push(Createticket);
  }

  getTicketOpen() {
    if(localStorage.getItem('userData')){
      this.commonProvider.presentLoading();

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token = this.userDetails.token;
      this.userTicketData.level = this.userDetails.level;

      if (this.userDetails.level == 'user') {
        this.isAdmin = "1";
      }

      if (this.userTicketData.level =='admin') {
        this.statButton.respon = 'true';
        this.statButton.fixed = 'true';
      }else if (this.userTicketData.level =='user') {
        this.statButton.closed = 'true';
      }

      this.authServiceProvider.postData(this.userTicketData, 'getTicketOpen').then((result) => {
        this.responseData = result;

        if (this.responseData.ticketData) {
          this.items = this.responseData.ticketData;
          this.commonProvider.closeLoading(); 
        }else{
          this.commonProvider.closeLoading();
          this.presentToast("Connection Problem");
        }
      }, (err) => {
        this.commonProvider.closeLoading();
        this.presentToast("Connection Problem");
      });
    }
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.externalApplicationStorageDirectory + img;
    }
  }

  editTicket(ticket_id){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    if (ticket_id > 0){
      if (this.userDetails.level == 'admin') {
        this.navCtrl.push(Addticket,{
          ticket_id: ticket_id,
          status: 'Open'
        });
      }
      if (this.userDetails.level == 'user') {
        this.navCtrl.push(EditUsrTicket,{
          ticket_id: ticket_id,
          status: 'Open'
        });
      }      
    }else{
      this.presentToast("Connection Problem");
    }
  }

  fixedTicket(ticket_id,msgIndex){
    if (ticket_id > 0){

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token = this.userDetails.token;

      let confirm = this.alertController.create({
        title: 'Fixed Ticket',
        message: 'Do you want to Fixed ?',
        inputs: [
          {
            name: 'action_reason',
            placeholder: 'Action'
          }
        ],
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: data=>{
              this.userTicketData.ticket_id = ticket_id;
              this.userTicketData.action_reason = data.action_reason;
              this.authServiceProvider.postData(this.userTicketData, 'fixedTicket').then((result) => {
                this.responseData = result;
                if (this.responseData.success) {
                  this.items.splice(msgIndex,1)
                }else{
                  this.presentToast("Connection Problem");
                }
              }, (err) => {
                 this.presentToast("Connection Problem");
              });
            }
          }
        ]
      });
      confirm.present();
    }else{
      this.presentToast("Connection Problem");
    }
  }

  responTicket(ticket_id,msgIndex){
    if (ticket_id > 0){

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token = this.userDetails.token;

      let confirm = this.alertController.create({
        title: 'Respon Ticket',
        message: 'Do you want to Respon ?',
        inputs: [
          {
            name: 'action_reason',
            placeholder: 'Action'
          }
        ],
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: data => {
              this.userTicketData.ticket_id = ticket_id;
              this.userTicketData.action_reason = data.action_reason;
              this.authServiceProvider.postData(this.userTicketData, 'responTicket').then((result) => {
                this.responseData = result;
                if (this.responseData.success) {
                  this.items.splice(msgIndex,1)
                }else{
                  this.presentToast("Connection Problem");
                }
              }, (err) => {
                 this.presentToast("Connection Problem");
              });
            }
          }
        ]
      });
      confirm.present();
    }else{
      this.presentToast("Connection Problem");
    }
  }

  closedTicket(ticket_id,category,msgIndex){
    if (ticket_id > 0){

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token   = this.userDetails.token;
      this.userTicketData.category= category;

      let confirm = this.alertController.create({
        title: 'Closed Ticket ?',
        inputs: [
          {
            name: 'closed_reason',
            placeholder: 'Closed Reason'
          },
        ],
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: data=>{
              this.userTicketData.ticket_id = ticket_id;
              this.userTicketData.closed_reason = data.closed_reason
              this.userTicketData.category = category
              console.log(this.userTicketData);
              this.authServiceProvider.postData(this.userTicketData, 'closedTicket').then((result) => {
                this.responseData = result;
                if (this.responseData.success) {
                  this.items.splice(msgIndex,1)
                }else{
                  this.presentToast("Connection Problem");
                }
              }, (err) => {
                 this.presentToast("Connection Problem");
              });
            }
          }
        ]
      });
      confirm.present();
    }else{
      this.presentToast("Connection Problem");
    }
  }
}
