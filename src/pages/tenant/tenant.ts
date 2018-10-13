import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';
import { SplitPage } from '../split/split';

/**
 * Generated class for the TenantPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tenant',
  templateUrl: 'tenant.html',
})
export class TenantPage {

	tenant: boolean;
	responseData: any;
	userRegister = {
		"name":"",
		"email":"",
		"password":"",
		"repassword":"",
		"phone":"",
		"tenant_id":"",
		"selTenant":"",
		"isTenant" : "",
		"text":"",
		"device_token": ""
	};

	tenantData = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public toastCtrl: ToastController,
  	public alertCtrl: AlertController,
  	public authServiceProvider: AuthServiceProvider,
  	public commonProvider: CommonProvider 
  ) 
  {
  	this.inIt();
  }

  public presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public inIt(){
		this.authServiceProvider.postData(this.userRegister, "getTenant").then((result) =>{
			this.responseData = result;

			if (this.responseData) {
				this.tenantData = this.responseData.tenantData;
				//console.log(this.tenantData);
			}else{
				this.presentToast("Connection Problem");
			}

	  }, (err) => {
	  	this.presentToast("Connection Problem");
		});
	}

  public createUser(){	
		if (
			this.userRegister.name != "" && 
			this.userRegister.email != "" && 
			this.userRegister.phone != "" && 
			this.userRegister.password != "" && 
			this.userRegister.repassword != ""
		) {
			
    	const regexp = new RegExp('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    	
			console.log(regexp.test(this.userRegister.email)); 
			if (this.userRegister.password != this.userRegister.repassword){
				this.presentToast("Password Not Match");
			}else if (!regexp.test(this.userRegister.email)) {
				this.presentToast("Email Not Valid");
			}else if (this.tenant && this.userRegister.selTenant == "") {
				this.presentToast("Please Select Tenant");
			}else{
				if (this.tenant) {
	  			this.userRegister.isTenant = "1";
	  		}else{
	  			this.userRegister.isTenant = "0";
	  		}
	  		
	  		this.userRegister.device_token = localStorage.getItem('device_token');
				this.commonProvider.presentLoading();
				//console.log(this.userRegister);
  			this.authServiceProvider.postData(this.userRegister, "register").then((result) =>{
					this.responseData = result;

        	if(this.responseData.userData){
        		if (this.responseData.userData.text == 'Registered') {
        			this.commonProvider.closeLoading();	
        			this.presentToast("User Already Registered");
        		}else{
        			this.commonProvider.closeLoading();	
        			localStorage.setItem('userData', JSON.stringify(this.responseData))
          		this.navCtrl.push(SplitPage);
        		}
        	}else{
          	this.commonProvider.closeLoading();
          	this.presentToast("Connection Problem");
        	}
	    	}, (err) => {
        	this.commonProvider.closeLoading();
        	this.presentToast("Connection Problem");
	    	});
			}
		}else{
			this.presentToast("Fill The Blank");
		}
	}
}
