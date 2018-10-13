import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, PopoverController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';
import { Login } from '../login/login';
import { Addticket } from '../addticket/addticket';
import { EditUsrTicket } from '../editusrticket/editusrticket';
import { SettingsPage } from '../settings/settings';


/**
 * Generated class for the ResponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-respon',
  templateUrl: 'respon.html',
})
export class ResponPage {

  private userDetails: any;
  private items : any = [];
  private responseData: any;
  public inItData: any;

  public statButton = {
    "open" : "",
    "fixed" : "",
    "closed" :""
  }

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
    "level":"",
    "action_reason":"",
    "closed_reason":"",
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
  ) 
  {

  }

  ionViewDidEnter() {
    this.inIt();
    this.getTicketRespon();
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
    
  }

  chgPage(){
    this.navCtrl.push(Addticket);
  }

  getTicketRespon() {
    if (!localStorage.getItem('userData')) {
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }else{
      this.commonProvider.presentLoading();

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token   = this.userDetails.token;
      this.userTicketData.level   = this.userDetails.level;

      if (this.userTicketData.level =='admin') {
        this.statButton.open   = 'true';
        this.statButton.fixed  = 'true';
      }else if (this.userTicketData.level =='user') {
        this.statButton.closed = 'true';
      }

      this.authServiceProvider.postData(this.userTicketData, 'getTicketRespon').then((result) => {
        this.responseData = result;
        if (this.responseData.ticketData) {
          this.items = this.responseData.ticketData;
          this.commonProvider.closeLoading(); 
        }else{
          this.commonProvider.closeLoading();
          this.presentToast("Connection Problem");
        }
      },(err) => {
        this.commonProvider.closeLoading();
        this.presentToast("Connection Problem");
      });
    }
  }

  editTicket(ticket_id){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    if (ticket_id > 0){
      if (this.userDetails.level == 'admin') {
        this.navCtrl.push(Addticket,{
          ticket_id: ticket_id,
          status: 'Respon'
        });
      }

      if (this.userDetails.level == 'user') {
        this.navCtrl.push(EditUsrTicket,{
          ticket_id: ticket_id,
          status: 'Respon'
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
              //console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: data => {
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
      this.presentToast("Connection Problem");
    }
  }

  closedTicket(ticket_id,category,msgIndex){
    if (ticket_id > 0){

      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userTicketData.user_id = this.userDetails.user_id;
      this.userTicketData.token = this.userDetails.token;

      let confirm = this.alertController.create({
        title: 'Closed Ticket',
        message: 'Do you want to Closed ?',
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
              //console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: data=>{
              this.userTicketData.ticket_id  = ticket_id;
              this.userTicketData.category   = category;
              this.userTicketData.closed_reason = data.closed_reason
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
