import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { SplitPage } from '../split/split';
import { TenantPage } from '../tenant/tenant';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  private responseData : any ;
  public userData = {"username":"","password":"","device_token": ""};

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public toastController: ToastController,
  	public authServiceProvider: AuthServiceProvider,
    public commonProvider: CommonProvider
  	) {
    
  }

  login(){
  	if(this.userData.username && this.userData.password){

      this.userData.device_token = localStorage.getItem('device_token');
      //alert(this.userData.device_token);
      this.commonProvider.presentLoading();
  	  this.authServiceProvider.postData(this.userData, "login").then((result) =>{
        this.responseData = result;

        if(this.responseData.userData){
          //console.log(this.responseData.userData);
          if (this.responseData.userData.mobile_status == 1) {
            localStorage.setItem('userData', JSON.stringify(this.responseData))
            this.commonProvider.closeLoading();
            this.navCtrl.push(SplitPage);
          }else{
            this.commonProvider.closeLoading();
            this.presentToast("Contact Admin, Your User Inactive");
          }
        }else{
          this.commonProvider.closeLoading();
         	this.presentToast("Wrong Email or Password");    
        }
		}, (err) => {
        this.commonProvider.closeLoading();
        this.presentToast("Connection Problem");
       });
  	}else{
  	  this.presentToast("Fill the Blank");
  	}

  }

  register(){
    this.navCtrl.push(TenantPage);
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
