import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the QuestionnairePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-questionnaire',
  templateUrl: 'questionnaire.html',
})
export class QuestionnairePage {

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public popoverCtrl: PopoverController) {
  }

  showSetting(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionnairePage');
  }

}
