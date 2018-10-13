import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, App, MenuController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { File } from '@ionic-native/file';
import { CommonProvider } from '../../providers/common/common';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */	

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

	public responseData : any ;
	public userDetails : any;
	public settingData = {
		"user_id":"",
		"username": "",
		"password" : "",
		"name" : "",
		"email" : "",
		"level" : "",
		"token" : "",
		"passVal" : "",
    "phone" : "",
    "profile_image":"assets/img/chatterplace.png"
	}

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams, 
  	public toastCtrl:ToastController,
  	public authServiceProvider: AuthServiceProvider,
  	public app: App,
    public menu: MenuController,
    public camera: Camera,
    private file: File, 
    private filePath: FilePath,
    public commonProvider: CommonProvider
  ){
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

  inIt(){
  	if (localStorage.getItem('userData')) {
  		const data =  JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.settingData.user_id = this.userDetails.user_id;
      this.settingData.token = this.userDetails.token;

      this.commonProvider.presentLoading();
  		this.authServiceProvider.postData(this.settingData, "getSettingUser").then((result) =>{
	      this.responseData = result;  
	      if(this.responseData.getSettingUser){
          this.commonProvider.closeLoading();
	        const dataSettingUser =  this.responseData;
	        this.settingData = dataSettingUser.getSettingUser;

          if (this.settingData.profile_image == '') {
            this.settingData.profile_image = "assets/img/chatterplace.png";
          }else{
            this.settingData.profile_image = "http://219.83.56.90:81/InSys/uploaded/api/profile/"+this.settingData.user_id+"/"+this.settingData.profile_image;
          }  
	        this.settingData.password = "";
	      }else{
          this.commonProvider.closeLoading();
	        this.presentToast("Connection Problem");
	      }
	    }, (err) => {
        this.commonProvider.closeLoading();
	      this.presentToast("Connection Problem");
	    });
  	}else{
  		//this.presentToast("Login First");
      //this.navCtrl.push(Login);
  	}
  }

  public createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }



  public copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.externalApplicationStorageDirectory, newFileName).then(success => {
      this.settingData.profile_image = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  editimage(){
    var options = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    const data =  JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          let newName = this.createFileName();

          this.file.copyFile(correctPath, currentName, cordova.file.externalApplicationStorageDirectory, newName).then(success => {
            this.settingData.profile_image = cordova.file.externalApplicationStorageDirectory + newName;

            this.commonProvider.presentLoading();
            this.authServiceProvider.sendImage(
              this.userDetails.user_id,
              newName,
              cordova.file.externalApplicationStorageDirectory + newName,
              "sendImageProfile"
            ).then((result)=>{
              this.commonProvider.closeLoading();
              this.presentToast("Succes Upload Image");
            },(err)=>{
              this.commonProvider.closeLoading();
              this.presentToast("Upload Image Problem");
            });
          }, error => {
            this.presentToast('Error while storing file.');
          });

        });
    }, (err) => {
      //this.presentToast('Error while selecting image.');
    });
  }

  updateProfile(user_id){
  	if(this.settingData.password != "" && this.settingData.passVal != ""){
	  	if (this.settingData.password != this.settingData.passVal) {
	  		this.presentToast("Password not Match");
	  	}else if (this.settingData.username == "") {
	  		this.presentToast("Fill Username");
	  	}else if (this.settingData.name == "") {
	  		this.presentToast("Fill Name");
	  	}else if (this.settingData.email == "") {
	  		this.presentToast("Fill Email");
	  	}else{
	  		this.settingData.user_id = user_id;

	  		this.authServiceProvider.postData(this.settingData, "updatePass").then((result) =>{
          this.responseData = result;       
          if(this.responseData.success){
            this.presentToast("Update Succes");
            //this.viewCtrl.dismiss();
          }else{
            this.presentToast("Connection Problem");
          }
        }, (err) => {
          this.presentToast("Connection Problem");
        });
	  	}
	  }else{
	  	if (this.settingData.username == "") {
	  		this.presentToast("Fill Username");
	  	}else if (this.settingData.name == "") {
	  		this.presentToast("Fill Name");
	  	}else if (this.settingData.email == "") {
	  		this.presentToast("Fill Email");
	  	}else{
	  		this.settingData.user_id = user_id;
	  		this.authServiceProvider.postData(this.settingData, "updateNotPass").then((result) =>{
          this.responseData = result;       

          if(this.responseData.success){
            this.presentToast("Update Succes");
            //this.viewCtrl.dismiss();

          }else{
            this.presentToast("Connection Problem");
          }

        }, (err) => {
          this.presentToast("Connection Problem");
        });
	  	}
	  }
  }

}
