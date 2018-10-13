import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController,PopoverController } from 'ionic-angular';
import { Createticket } from '../createticket/createticket';
import { CommonProvider } from '../../providers/common/common';
import { Login } from '../login/login';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the News page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class News {

  slides: Slide[];
  showSkip  = true;
  isAdmin   = "";
  userDetails: any;

  TUTORIAL_SLIDE1_TITLE = 'Welcome to the Helpdesk <br><b>PT. Persada Puri Tama</b>';
  TUTORIAL_SLIDE1_DESCRIPTION = 'The <b>Helpdesk Aplication</b> can you use for your complaint or any news.';
  TUTORIAL_SLIDE2_TITLE = 'How to use the Aplication';
  TUTORIAL_SLIDE2_DESCRIPTION = 'Just click / push add buton and you can create a ticket';
  TUTORIAL_SLIDE3_TITLE = 'Make you Fell at Home';
  TUTORIAL_SLIDE3_DESCRIPTION = 'Where your story begins';
  TUTORIAL_SLIDE4_TITLE = 'Getting Started';
  TUTORIAL_SLIDE4_DESCRIPTION = 'Need help? Check out the phone number or whatsapp on 087 700 7000 60';


  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public commonProvider: CommonProvider,
    public toastCtrl:ToastController,
    public menu: MenuController,
    public popoverCtrl : PopoverController
  ) {
    if (localStorage.getItem('userData')) {
      const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      if (this.userDetails.level == 'user') {
        this.isAdmin = "1";
      }

      this.menu.enable(true);
  	  this.slides = [
          {
            title: this.TUTORIAL_SLIDE1_TITLE,
            description: this.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/1.png',
          },
          {
            title: this.TUTORIAL_SLIDE2_TITLE,
            description: this.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/2.png',
          },
          {
            title: this.TUTORIAL_SLIDE3_TITLE,
            description: this.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/3.png',
          },
          {
            title: this.TUTORIAL_SLIDE4_TITLE,
            description: this.TUTORIAL_SLIDE4_DESCRIPTION,
            image: 'assets/img/4.png',
          }
        ];
    }else{
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad News');
    this.menu.enable(true);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  onClick(){
  	this.navCtrl.push(Createticket);
  }

}
