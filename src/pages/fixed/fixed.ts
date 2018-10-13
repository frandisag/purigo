import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, PopoverController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';
import { Login } from '../login/login';
import { EditUsrTicket } from '../editusrticket/editusrticket';
import { Addticket } from '../addticket/addticket';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the FixedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-fixed',
  templateUrl: 'fixed.html',
})
export class FixedPage {

  private userDetails: any;
  private items : any = [];
  private responseData: any;
  public inItData: any;

  ticketData = {
    "subject":"",
    "category":"",
    "location":"",
    "desc":"",
    "user_id":"",
    "token":"",
    "ticket_id":""
  };

  userTicketData = {
    "user_id":"",
    "token":"", 
    "ticket_id":"",
    "level":""
  };

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public commonProvider: CommonProvider,
    private alertController: AlertController,
  	public toastCtrl:ToastController,
    public popoverCtrl: PopoverController
  ) 
  {

  }

  ionViewDidEnter() {
    this.inIt();
    this.getTicketFixed();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  showSetting(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  inIt(){
    if (!localStorage.getItem('userData')) {
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }
  }

  chgPage(){
    this.navCtrl.push(Addticket);
  }

  getTicketFixed() {
    this.commonProvider.presentLoading();

    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.userTicketData.user_id = this.userDetails.user_id;
    this.userTicketData.token = this.userDetails.token;
    this.userTicketData.level = this.userDetails.level;

    this.authServiceProvider.postData(this.userTicketData, 'getTicketFixed').then((result) => {
      this.responseData = result;

      console.log(this.responseData);
      if (this.responseData.ticketData) {
        this.items = this.responseData.ticketData;
        this.commonProvider.closeLoading(); 
      }else{
        console.log('abis');
        this.commonProvider.closeLoading();
        this.presentToast("Connection Problem");
      }

    }, (err) => {
      console.log('cek');
      this.commonProvider.closeLoading();
      this.presentToast("Connection Problem");
    });
  }

  editTicket(ticket_id){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    if (ticket_id > 0){
      if (this.userDetails.level == 'admin') {
        this.navCtrl.push(Addticket,{
          ticket_id: ticket_id,
          status: 'Fixed'
        });
      }

      if (this.userDetails.level == 'user') {
        this.navCtrl.push(EditUsrTicket,{
          ticket_id: ticket_id,
          status: 'Fixed'
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
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.userTicketData.ticket_id = ticket_id;
              this.authServiceProvider.postData(this.userTicketData, 'fixedTicket').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
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
      //Error handling
      this.presentToast("Connection Problem");
    }
  }

  openTicket(ticket_id,msgIndex){
    if (ticket_id > 0){

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token = this.userDetails.token;

      let confirm = this.alertController.create({
        title: 'Open Ticket',
        message: 'Do you want to Open ?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.userTicketData.ticket_id = ticket_id;
              this.authServiceProvider.postData(this.userTicketData, 'openTicket').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
                if (this.responseData.success) {
                  this.items.splice(msgIndex,1)
                }else{
                  this.presentToast("Connection Problem a");
                }
              }, (err) => {
                 this.presentToast("Connection Problem b");
              });
            }
          }
        ]
      });
      confirm.present();
    }else{
      //Error handling
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
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.userTicketData.ticket_id = ticket_id;
              this.authServiceProvider.postData(this.userTicketData, 'responTicket').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
                if (this.responseData.success) {
                  this.items.splice(msgIndex,1)
                }else{
                  this.presentToast("Connection Problem a");
                }
              }, (err) => {
                 this.presentToast("Connection Problem b");
              });
            }
          }
        ]
      });
      confirm.present();
    }else{
      //Error handling
      this.presentToast("Connection Problem");
    }
  }

  closedTicket(ticket_id,msgIndex){
    if (ticket_id > 0){

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token = this.userDetails.token;

      let confirm = this.alertController.create({
        title: 'Closed Ticket',
        message: 'Do you want to Closed ?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.userTicketData.ticket_id = ticket_id;
              this.authServiceProvider.postData(this.userTicketData, 'closedTicket').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
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
      //Error handling
      this.presentToast("Connection Problem");
    }
  }
}
