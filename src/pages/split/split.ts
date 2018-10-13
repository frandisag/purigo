import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav, MenuController, ToastController, AlertController } from 'ionic-angular';

import { Invoice } from '../invoice/invoice';
import { News } from '../news/news';
import { Ticket } from '../ticket/ticket';
import { BookingPage } from '../booking/booking';
import { ContractPage } from '../contract/contract';
import { QuestionnairePage } from '../questionnaire/questionnaire';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the SplitPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-split',
  templateUrl: 'split.html',
})
export class SplitPage {
	@ViewChild(Nav) nav: Nav;

	pages: Array<{title: string, component: any}>;
	rootPage: any = News;
  userDetails: any;
  responseData: any;
  userTicketData = {"user_id":""}

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menu: MenuController,
    public alertCtrl: AlertController,
    public authServiceProvider : AuthServiceProvider,
    public toastCtrl:ToastController
  ) 
  {
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
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.userTicketData.user_id = this.userDetails.user_id;
    this.authServiceProvider.postData(this.userTicketData, "seeMenus").then((result) =>{
      this.responseData = result;
      //console.log(this.responseData);
      if (data.userData.level == 'admin') {
        if (this.responseData.category = 'Marketing') {
          this.pages = [
            { title: 'News', component: News },
            { title: 'Care', component: Ticket },
            { title: 'Booking', component: BookingPage }
            //{ title: 'Billing', component: Invoice },
            //{ title: 'Contract', component: ContractPage },
            //{ title: 'Questionnaire', component: QuestionnairePage }
          ];
        }else{
          this.pages = [
            { title: 'News', component: News },
            { title: 'Care', component: Ticket }
            //{ title: 'Booking', component: BookingPage },
            //{ title: 'Billing', component: Invoice },
            //{ title: 'Contract', component: ContractPage },
            //{ title: 'Questionnaire', component: QuestionnairePage }
          ];
        } 
      }else if(data.userData.level == 'superadmin'){
        this.pages = [
          { title: 'News', component: News },
          { title: 'Care', component: Ticket },
          { title: 'Booking', component: BookingPage },
          { title: 'Billing', component: Invoice },
          { title: 'Contract', component: ContractPage },
          { title: 'Questionnaire', component: QuestionnairePage }
        ];
      }else if (data.userData.level == 'user' && data.userData.istenant == '0') {
        this.pages = [
          { title: 'News', component: News },
          { title: 'Care', component: Ticket },
          { title: 'Booking', component: BookingPage }
          //{ title: 'Questionnaire', component: QuestionnairePage }
        ]; 
      }else if (data.userData.level == 'user' && data.userData.istenant == '1') {
        this.pages = [
          { title: 'News', component: News },
          { title: 'Care', component: Ticket },
          { title: 'Booking', component: BookingPage }
          //{ title: 'Billing', component: Invoice },
          //{ title: 'Contract', component: ContractPage },
          //{ title: 'Questionnaire', component: QuestionnairePage }
        ]; 
      }
    },(err) => {
      this.presentToast("Connection Problem");
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }

}
