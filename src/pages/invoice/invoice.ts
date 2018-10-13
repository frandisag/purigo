import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the Invoice page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class Invoice {

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public popoverCtrl: PopoverController
  ) 
  {

  }

  showSetting(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

}
