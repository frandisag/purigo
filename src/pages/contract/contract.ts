import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the ContractPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-contract',
  templateUrl: 'contract.html',
})
export class ContractPage {

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractPage');
  }

}
