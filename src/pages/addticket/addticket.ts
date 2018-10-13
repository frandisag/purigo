import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Ticket } from '../ticket/ticket';
import { ResponPage } from '../respon/respon';
import { Login } from '../login/login';

import { CommonProvider } from '../../providers/common/common';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

/**
 * Generated class for the Addticket page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-addticket',
  templateUrl: 'addticket.html',
})
export class Addticket {

  userCredential: any;
  userDetails : any;
  dataCoba: any;
  ticket_id : any;
  responseData: any;
  lastImage : any;

  closedReason = {
    "status":""
  }

  statuslastImage = {
    "status":"true"
  };

  statusValue = {
    "status":""
  }

  optionValue = {
    "open":"",
    "respon":"",
    "fixed":"",
    "closed":""
  }

  ticketData = {
  	"subject":"",
  	"category":"",
  	"location":"",
  	"description":"",
  	"user_id":"",
  	"token":"",
    "ticket_id":"",
    "status":"",
    "action_reason" : "",
    "name": "",
    "updated_name":"",
    "img_submit":"",
    "img_status" : "",
    "img_path": ""
  };

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public toastCtrl:ToastController,
    private camera: Camera,
    private file: File,
    private commonProvider: CommonProvider ) {
    this.inIt();
  }

  public createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  public copyFileToLocalDir(namePath, currentName, newFileName) {
    this.statuslastImage.status = "";
    this.file.copyFile(namePath, currentName, cordova.file.externalApplicationStorageDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.ticketData.img_path = cordova.file.externalApplicationStorageDirectory + newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
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
    if (!localStorage.getItem('userData')) {
      this.presentToast("Login First");
      this.navCtrl.push(Login);
    }else{
      if (this.navParams.get('ticket_id')) {
        if (this.navParams.get('status')) {
          if (this.navParams.get('status') == 'Closed') {
            this.statusValue.status = "";
            this.optionValue.respon ="true"
            this.optionValue.fixed ="true"
            this.optionValue.open ="true"
            this.optionValue.closed ="true"
            this.closedReason.status = "true"
          }
          if (this.navParams.get('status') == 'Respon') {
            this.statusValue.status = "true";
            this.optionValue.respon ="true"
            this.optionValue.fixed ="true"
            this.optionValue.open ="true"
            this.closedReason.status = "true"
          }
          if (this.navParams.get('status') == 'Fixed') {
            this.statusValue.status = "true";
            this.optionValue.respon ="true"
            this.optionValue.fixed ="true"
            this.optionValue.open ="true"
            this.closedReason.status = "true"
          }
          if (this.navParams.get('status') == 'Open') {
            this.statusValue.status = "true";
            this.optionValue.respon ="true"
            this.optionValue.fixed ="true"
            this.optionValue.open ="true"
            this.closedReason.status = ""
          }
        }

        const data =  JSON.parse(localStorage.getItem('userData'));
        this.userDetails = data.userData;

        this.ticketData.user_id = this.userDetails.user_id;
        this.ticketData.token = this.userDetails.token;
        this.ticketData.ticket_id = this.navParams.get('ticket_id');

        this.authServiceProvider.postData(this.ticketData, "getEditOpen").then((result) =>{
          this.responseData = result;       

          if(this.responseData.ticketOpenData){
            const dataTicket =  this.responseData;
            this.ticketData = dataTicket.ticketOpenData;
            this.ticketData.img_status = dataTicket.ticketOpenData.image_submit;
            this.ticketData.img_submit = "http://219.83.56.90:81/insys/uploaded/api/uploads/"+this.navParams.get('ticket_id')+"/"+dataTicket.ticketOpenData.image_submit;

            if (dataTicket.ticketOpenData.image_action != '') {
              this.statuslastImage.status = "";
              this.file.checkFile(cordova.file.externalApplicationStorageDirectory,dataTicket.ticketOpenData.image_action).then(
                (files) => {
                  this.ticketData.img_path = cordova.file.externalApplicationStorageDirectory + dataTicket.ticketOpenData.image_action;
                }
              ).catch(
                (err) => {
                  this.ticketData.img_path = "http://219.83.56.90:81/insys/uploaded/api/uploads/"+this.navParams.get('ticket_id')+"/"+dataTicket.ticketOpenData.image_action;
                }
              );
            }
          }else{
            this.presentToast("Connection Problem");
          }
        }, (err) => {
          this.presentToast("Connection Problem");
        });
      }
    }
  }

  openCamera(){
    var options = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imagePath) => {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  updateAdmTicket(statusPage){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.ticketData.user_id = this.userDetails.user_id;
    this.ticketData.token = this.userDetails.token;
    this.ticketData.ticket_id = this.navParams.get('ticket_id');

    if(this.ticketData.status){
      this.commonProvider.presentLoading();
      this.authServiceProvider.postData(this.ticketData, "updateAdmTicket").then((result) =>{
          this.responseData = result;
          if(this.responseData.success){
            if (this.lastImage) {
              this.authServiceProvider.sendAdmImage(
                this.ticketData.ticket_id,
                this.lastImage,
                this.ticketData.img_path,
                "sendAdmImage"
              ).then((result)=>{
                this.commonProvider.closeLoading();
                if (this.navParams.get('status') == 'Open') {
                  this.commonProvider.closeLoading();
                  this.navCtrl.push(Ticket);
                }
                if (this.navParams.get('status') == 'Respon') {
                  this.commonProvider.closeLoading();
                  this.navCtrl.push(ResponPage);
                }
              },(err)=>{
                this.commonProvider.closeLoading();
                this.presentToast("Upload Image Problem");
              }); 
            }else{
              if (this.navParams.get('status') == 'Open') {
                this.commonProvider.closeLoading();
                this.navCtrl.push(Ticket);
              }
              if (this.navParams.get('status') == 'Respon') {
                this.commonProvider.closeLoading();
                this.navCtrl.push(ResponPage);
              }
            }
          }else{
            this.commonProvider.closeLoading();
            this. presentToast("Fill Action");
          }
      }, (err) => {
          this.commonProvider.closeLoading();
          this.presentToast("Connection Problem");
      });
    }else{
        this.presentToast("Fill the Blank");
    }
  }

}
