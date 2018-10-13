import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the MarketingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-marketing',
  templateUrl: 'marketing.html',
})
export class MarketingPage {

	category : any;
	data = {
		"category":""
	};

	responseData : any;
	items : any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public commonProvider: CommonProvider,
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
  	this.category = this.navParams.get('category');
  	this.data.category = this.navParams.get('category');

  	this.commonProvider.presentLoading();
  	this.authServiceProvider
  		.postData(this.data, 'getSettingUserNotif')
  		.then((result) => {
      	this.responseData = result;
      	if (this.responseData.userData) {
      		this.commonProvider.closeLoading(); 
        	this.items = this.responseData.userData;
      	}else{
        	this.commonProvider.closeLoading();
        	this.presentToast("Connection Problem");
      	}
    	},
    	(err) => {
      	this.commonProvider.closeLoading();
      	this.presentToast("Connection Problem");
      });
  }
}
