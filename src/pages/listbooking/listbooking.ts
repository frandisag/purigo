import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { AddbookPage } from '../addbook/addbook';
import { MarketingchatPage } from '../marketingchat/marketingchat';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the ListbookingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-listbooking',
  templateUrl: 'listbooking.html',
})
export class ListbookingPage {

	param = {
		"type":"",
		"user_id":"",
		"token":"",
		"level":"",
    "user":"",
    "admin":"",
    "superadmin":""
	}
	items : any = [];
	responseData: any;
  isAdmin   = "";

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider : AuthServiceProvider,
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListbookingPage');
  }

  inIt(){
  	const data =  JSON.parse(localStorage.getItem('userData'));

  	this.param.type = this.navParams.get('type');
  	this.param.user_id = data.userData.user_id;
  	this.param.token = data.userData.token;
  	this.param.level = data.userData.level;

    if (this.param.level == 'user') {
        this.isAdmin = "1";
      }

    if (this.param.level == 'admin') {
      this.param.admin = "true";
    }

    if (this.param.level == 'superadmin') {
      this.param.superadmin = "true";
    }

    if (this.param.level == 'user') {
      this.param.user = "true";
    }

  	this.commonProvider.presentLoading();
  	this.authServiceProvider.postData(this.param, 'getBook').then((result) => {
  		this.commonProvider.closeLoading();
  		this.responseData = result;
  		this.items = this.responseData.bookData;
  	},(err)=>{
  		this.commonProvider.closeLoading();
      this.presentToast("Connection Problem");
  	})
  }

  openBook(type){
  	this.navCtrl.push(AddbookPage,{
  		"type": this.navParams.get('type')
  	});
  }

  openChat(book_id){
    this.navCtrl.push(MarketingchatPage,{
      "book_id": book_id
    })    
  }

  detailBook(book_id){
  	this.navCtrl.push(AddbookPage,{
  		"type": this.navParams.get('type'),
  		"book_id": book_id
  	})
  }

}
