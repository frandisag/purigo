import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Login } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Addticket } from '../addticket/addticket';
import { EditUsrTicket } from '../editusrticket/editusrticket';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the ClosedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-closed',
  templateUrl: 'closed.html',
})
export class ClosedPage {

  private userDetails: any;
  private items : any = [];
  private responseData: any;

  private ticketData = {
  	  "user_id":"",
  	  "token":"",
      "level":""
  };

  userTicketData = {
    "user_id":"",
    "token":"", 
    "ticket_id":""
  };

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public commonProvider: CommonProvider,
  	public toastCtrl:ToastController,
    public popoverCtrl: PopoverController
  ) 
  {	  	

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  ionViewDidEnter() {
    this.inIt();
  	this.getTicketClosed();
  }

  inIt(){
    if (!localStorage.getItem('userData')) {
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }
  }

  showSetting(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  editTicket(ticket_id){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    if (ticket_id > 0){
      if (this.userDetails.level == 'admin') {
        this.navCtrl.push(Addticket,{
          ticket_id: ticket_id,
          status: 'Closed'
        });
      }

      if (this.userDetails.level == 'user') {
        this.navCtrl.push(EditUsrTicket,{
          ticket_id: ticket_id,
          status: 'Closed'
        });
      }      
    }else{
      this.presentToast("Connection Problem");
    }
  }

  getTicketClosed() {
    this.commonProvider.presentLoading();

    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.ticketData.user_id = this.userDetails.user_id;
    this.ticketData.token = this.userDetails.token;
    this.ticketData.level = this.userDetails.level;
    console.log (this.ticketData);
    this.authServiceProvider.postData(this.ticketData, 'getTicketClosed').then((result) => {
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
