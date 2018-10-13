import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { OpenPage } from '../open/open';
import { Login } from '../login/login';
import { ResponPage } from '../respon/respon';
import { FixedPage } from '../fixed/fixed';
import { ClosedPage } from '../closed/closed';

/**
 * Generated class for the Ticket page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class Ticket {
  
  tab1Root = OpenPage;
  tab2Root = ResponPage;
  tab3Root = FixedPage;
  tab4Root = ClosedPage;

  constructor(
    public toastCtrl:ToastController,
    public navCtrl: NavController) 
  {
    this.inIt();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  inIt(){
    if (!localStorage.getItem('userData')) {
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }
  }  
}
