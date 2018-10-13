import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Push } from '@ionic-native/push';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { News } from '../pages/news/news';
import { Login } from '../pages/login/login';
import { Ticket } from '../pages/ticket/ticket';
import { Addticket } from '../pages/addticket/addticket';
import { Createticket } from '../pages/createticket/createticket';
import { OpenPage } from '../pages/open/open';
import { ResponPage } from '../pages/respon/respon';
import { FixedPage } from '../pages/fixed/fixed';
import { ClosedPage } from '../pages/closed/closed';
import { Profile } from '../pages/profile/profile';
import { Invoice } from '../pages/invoice/invoice';
import { EditUsrTicket } from '../pages/editusrticket/editusrticket';
import { TenantPage } from '../pages/tenant/tenant';
import { ContractPage } from '../pages/contract/contract';
import { QuestionnairePage } from '../pages/questionnaire/questionnaire';
import { BookingPage } from '../pages/booking/booking';
import { SettingsPage } from '../pages/settings/settings';
import { MarketingPage } from '../pages/marketing/marketing';
import { SplitPage } from '../pages/split/split';
import { ListbookingPage } from '../pages/listbooking/listbooking';
import { AddbookPage } from '../pages/addbook/addbook';
import { MarketingchatPage } from '../pages/marketingchat/marketingchat';

import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { IonicImageLoader } from 'ionic-image-loader';


import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { CommonProvider } from '../providers/common/common';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    News,
    Login,
    Ticket,
    Addticket,
    OpenPage,
    ResponPage,
    FixedPage,
    ClosedPage,
    Profile,
    Createticket,
    EditUsrTicket,
    Invoice,
    TenantPage,
    ContractPage,
    QuestionnairePage,
    SettingsPage,
    BookingPage,
    MarketingPage,
    SplitPage,
    ListbookingPage,
    AddbookPage,
    MarketingchatPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicImageViewerModule,
    IonicImageLoader.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    News,
    Login,
    Ticket,
    Addticket,
    OpenPage,
    ResponPage,
    FixedPage,
    ClosedPage,
    Profile,
    Createticket,
    EditUsrTicket,
    Invoice,
    TenantPage,
    ContractPage,
    QuestionnairePage,
    SettingsPage,
    BookingPage,
    MarketingPage,
    SplitPage,
    ListbookingPage,
    AddbookPage,
    MarketingchatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    Camera,
    Push,
    FilePath,
    Vibration,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    CommonProvider
  ]
})
export class AppModule {}
