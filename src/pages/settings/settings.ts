import { Component } from '@angular/core';
import { NavController, ViewController, App, ToastController } from 'ionic-angular';
import { Profile } from '../profile/profile';
import { Login } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  show : boolean = true;
  level : string;
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController, 
    public app:App,
    public authServiceProvider : AuthServiceProvider,
    public toastCtrl: ToastController
  ) 
  {
    const data =  JSON.parse(localStorage.getItem('userData'));
    if(data.userData.level == 'superadmin'){
      this.show = false;
    }
  }

  openProfile(){
    this.app.getRootNav().push(Profile);
  	//this.navCtrl.push(Profile);
  	this.viewCtrl.dismiss();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  logOut(){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.authServiceProvider.postData(data.userData, 'logout').then((result) => {
      this.presentToast("Success Logout");
    }, (err) => {
      this.presentToast("Connection Problem");
    });

    localStorage.removeItem('userData');
    this.viewCtrl.dismiss();
    this.app.getRootNav().setRoot(Login);
  }

}