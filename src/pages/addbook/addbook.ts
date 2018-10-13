import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';

import { SplitPage } from '../split/split';
/**
 * Generated class for the AddbookPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-addbook',
  templateUrl: 'addbook.html',
})
export class AddbookPage {

	param = {
		"type":"",
		"company_name":"",
		"company_phone_number":"",
		"company_email":"",
		"company_type":"",
		"company_sector":"",
		"total_employee":"",
		"lease_time":"",
		"width_of_lease":"",
		"company_address":"",
		"note":"",
		"user_id":"",
		"token":"",
		"show":"true",
		"book_id":""
	}
	responseData: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider : AuthServiceProvider,
  	public toastCtrl:ToastController,
  	public commonProvider: CommonProvider,
  	public app: App
  ) {
  	this.inIt(this.navParams.get('type'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddbookPage');
  }

  inIt(type){
  	this.param.type = type;
  	if (this.navParams.get('book_id')) {
  		this.commonProvider.presentLoading();
  		const data =  JSON.parse(localStorage.getItem('userData'));

  		this.param.book_id = this.navParams.get('book_id');
  		this.param.user_id = data.userData.user_id;
  		this.param.token = data.userData.token;
  		//console.log(data.userData.user_id);
  		this.authServiceProvider.postData(this.param, "detailBook").then((result) =>{
  			this.responseData = result
  			console.log(this.responseData);
    		if (result) {
    			this.param.company_name = this.responseData.bookData.company_name;
    			this.param.company_phone_number = this.responseData.bookData.company_phone_number;
    			this.param.company_email = this.responseData.bookData.company_email;
    			this.param.company_type = this.responseData.bookData.company_type;
    			this.param.company_sector = this.responseData.bookData.company_sector;
    			this.param.total_employee = this.responseData.bookData.total_employee;
    			this.param.lease_time = this.responseData.bookData.lease_time;
    			this.param.width_of_lease = this.responseData.bookData.width_lease;
    			this.param.company_address = this.responseData.bookData.company_address;
    			this.param.show = "";
    			this.commonProvider.closeLoading();
    		}
    	},(err) => {
    		this.commonProvider.closeLoading();
        this.presentToast("Connection Problem");
    	});
  	}
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  createTicket(type){
  	const data =  JSON.parse(localStorage.getItem('userData'));

    this.param.user_id = data.userData.user_id;
    this.param.token = data.userData.token;
    this.param.type = type;

    if (
    	this.param.company_name &&
    	this.param.company_phone_number &&
    	this.param.company_email &&
    	this.param.company_type &&
    	this.param.company_sector &&
    	this.param.total_employee &&
    	this.param.lease_time &&
    	this.param.width_of_lease &&
    	this.param.company_address
    ){
    	this.commonProvider.presentLoading();
    	this.authServiceProvider.postData(this.param, "addBook").then((result) =>{
    		if (result) {
    			this.commonProvider.closeLoading();
    			this.presentToast("Success Send");
    			this.navCtrl.setRoot(SplitPage);
    		}
    	},(err) => {
    		this.commonProvider.closeLoading();
        this.presentToast("Connection Problem");
    	});
    }else{
    	this.presentToast("Fill the Blank");
    }
  }

}
