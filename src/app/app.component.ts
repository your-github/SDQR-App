import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage} from '../pages/login/login';
import {UserProvider} from "../providers/user/user";


@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  @ViewChild(Nav) nav: Nav;


  //userDetail: {email: string, fname: string, lname: string, upic: string};

  userDetail: any;
  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public userService: UserProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'About', component: ListPage }
    ];

    this.events.subscribe('showUser', () => {
      this.userService.getUser().then((success) => {
        this.userDetail = success;
      });
    });

    if(localStorage.getItem('sdqrusersession')){
      this.rootPage = HomePage;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  doLogout(){
    this.userService.logout().then(()=>{
      this.rootPage = LoginPage;
    })
  }


}
