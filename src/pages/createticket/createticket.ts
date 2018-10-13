import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Ticket } from '../ticket/ticket';

import { File } from '@ionic-native/file';
import { CommonProvider } from '../../providers/common/common';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

/**
 * Generated class for the Createticket page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-createticket',
  templateUrl: 'createticket.html',
})
export class Createticket {

	userDetails : any;
	responseData: any ;
  lastImage : any;

  statuslastImage = {
    "status":""
  };

  ticketData = {
  	"subject":"",
  	"category":"",
  	"location":"",
  	"desc":"",
  	"user_id":"",
  	"token":"",
    "ticket_id":"",
    "status":"",
    "action" : ""
  };

  categoryData = [];

  constructor(
  	public navCtrl: NavController, 
    private camera: Camera,
    public commonProvider: CommonProvider,
    private file: File, 
    private filePath: FilePath,
  	public navParams: NavParams,
  	public authServiceProvider: AuthServiceProvider,
  	public toastCtrl:ToastController
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

  public createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  public inIt(){
    this.authServiceProvider.postData(this.ticketData, "getCategory").then((result) =>{
      this.responseData = result;

      if (this.responseData) {
        this.categoryData = this.responseData.categoryData;
      }else{
        this.presentToast("Connection Problem");
      }

    }, (err) => {
      this.presentToast("Connection Problem");
    });
  }

  public openFolder(){
    var options = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    }, (err) => {
      //this.presentToast('Error while selecting image.');
    });
  }

  public openCamera(){
    var options = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
      //this.presentToast('Error while selecting image.');
    });
  }

  public copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.externalApplicationStorageDirectory, newFileName).then(success => {
      this.statuslastImage.status = newFileName;
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.externalApplicationStorageDirectory + img;
    }
  }

  public createTicket(){
    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    this.ticketData.user_id = this.userDetails.user_id;
    this.ticketData.token = this.userDetails.token;

  	if(this.ticketData.subject && this.ticketData.category && this.ticketData.location && this.ticketData.desc){
      this.commonProvider.presentLoading();
      console.log(this.ticketData);
  		this.authServiceProvider.postData(this.ticketData, "addTicket").then((result) =>{
        this.responseData = result;
        
        if(this.responseData.id){
          if (this.lastImage) {
            this.authServiceProvider.sendImage(
              this.responseData.id,
              this.lastImage,
              this.pathForImage(this.lastImage),
              "sendImage"
            ).then((result)=>{
              this.commonProvider.closeLoading();
              this.navCtrl.push(Ticket);
            },(err)=>{
              this.commonProvider.closeLoading();
              this.presentToast("Upload Image Problem");
            }); 
          }else{
            this.commonProvider.closeLoading();
            this.navCtrl.push(Ticket);
          }    
        }else{
          this.commonProvider.closeLoading();
          this. presentToast("Connection Problem 1");
        }
	    }, (err) => {
        this.commonProvider.closeLoading();
        this.presentToast("Connection Problem 2");
	    });
  	}else{
  	  this.presentToast("Fill the Blank");
  	}
  }
}
