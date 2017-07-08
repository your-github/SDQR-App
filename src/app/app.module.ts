import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from '@angular/http';

/*** IONIC native plugin */
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

/*** Firebase module */
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

/*** App component */
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage} from '../pages/login/login';

/***  IONIC Native Tool*/
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { SaleProvider } from '../providers/sale/sale';

import {edSecure} from '../protection/secure'


export const firebaseConfig = {
  apiKey: 'AIzaSyDKfhalS9iXAH1Lqr_Z7HcoYF0mHHmHfd0',
  authDomain: 'dbook-8d9fa.firebaseapp.com',
  databaseURL: 'https://dbook-8d9fa.firebaseio.com',
  projectId: 'dbook-8d9fa',
  storageBucket: 'dbook-8d9fa.appspot.com',
  messagingSenderId: '951635947188'
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
      LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    UserProvider,
    SaleProvider,
    edSecure
  ]
})
export class AppModule {}
