import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ListbookingPage } from '../listbooking/listbooking';

/**
 * Generated class for the BookingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public popoverCtrl: PopoverController
  ) 
  {
		  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
  }

  showSetting(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  openPage(type){
		this.navCtrl.push(ListbookingPage,{
			"type": type
		});
  }

}
