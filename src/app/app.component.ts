import { Component } from '@angular/core';
import { Platform, MenuController, AlertController, ToastController,App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Login } from '../pages/login/login';
import { SplitPage } from '../pages/split/split';
import { ListbookingPage } from '../pages/listbooking/listbooking';
import { Addticket } from '../pages/addticket/addticket';
import { EditUsrTicket } from '../pages/editusrticket/editusrticket';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NativeAudio } from '@ionic-native/native-audio';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;
  dataPush = {
    "device_token":"",
    "user_id":"",
    "token":""
  }; 

  constructor(
    public platform: Platform, 
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public push: Push,
    public authServiceProvider: AuthServiceProvider,
    public toastCtrl : ToastController,
    public app: App,
    public nativeAudio: NativeAudio,
  ) 
  {
    platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
    });
  }

  public presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  initPushNotification(){
    const options: PushOptions = {
      android: {
        sound: 'default',
        vibrate: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) =>{

      //const dataNotif = JSON.parse(notification);
      //alert(notification.additionalData.ticket_id);
      if (localStorage.getItem('userData')) {
        const data =  JSON.parse(localStorage.getItem('userData'));

        if (notification.additionalData.function == 'addTicket') {
          if (data.userData.level == 'admin') {
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getActiveNav().push(Addticket,{
                    ticket_id: notification.additionalData.ticket_id,
                    status: 'Open'
                  });
                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'closedTicket') {
          if (data.userData.level == 'admin') {
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getActiveNav().push(Addticket,{
                    ticket_id: notification.additionalData.ticket_id,
                    status: 'Closed'
                  });
                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'updateAdmTicket') {
          if (data.userData.level == 'user') {
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getActiveNav().push(EditUsrTicket,{
                    ticket_id: notification.additionalData.ticket_id,
                    status: notification.additionalData.status
                  });
                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'updateUsrTicket') {
          if (data.userData.level == 'admin') {
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getActiveNav().push(Addticket,{
                    ticket_id: notification.additionalData.ticket_id,
                    status: notification.additionalData.status
                  });
                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'addBook') {
          if (data.userData.level == 'admin') {
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getActiveNav().push(ListbookingPage,{
                    type: notification.additionalData.type
                  });
                }
              }]
            });
            confirmAlert.present();
          }
        }
      }
      //Notification Display Section
      /*let confirmAlert = this.alertCtrl.create({
        title: 'New Notification App',
        message: JSON.stringify(notification),
        buttons: [{
          text: 'Ignore',
          role: 'cancel'
        },{
          text: 'View',
          handler: () => {
            //TODO: Your logic here
            //self.nav.push(DetailsPage, {message: data.message});
          }
        }]
      });
      confirmAlert.present();*/
    });

    if (localStorage.getItem('device_token')) {
      if (localStorage.getItem('userData')) {
        this.rootPage = SplitPage ;
        this.menu.enable(true);
      }else{
        this.rootPage = Login ;
        this.menu.enable(false);
      }
    }else{
      pushObject.on('registration').subscribe((registration: any) => {
        localStorage.setItem('device_token', registration.registrationId)
      });

      if (localStorage.getItem('userData')) {
        this.rootPage = SplitPage ;
        this.menu.enable(true);
      }else{
        this.rootPage = Login ;
        this.menu.enable(false);
      }
    }

    pushObject.on('error').subscribe(error => {
      this.presentToast("Device Problem, Please restart Device");
    });

  }
}
    

