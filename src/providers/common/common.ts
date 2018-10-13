import { Injectable } from '@angular/core';
/*import { Http } from '@angular/http';*/
/*import 'rxjs/add/operator/map';*/
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CommonProvider {

  public loader : any ;

  constructor(public loadingController: LoadingController) {
    console.log('Hello CommonProvider Provider');
  }

  presentLoading(){
  	this.loader = this.loadingController.create({content: "Please wait ..."});
  	this.loader.present();
  }

  closeLoading(){
  	this.loader.dismiss();
  }

}
