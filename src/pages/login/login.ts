import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UserProvider} from '../../providers/user/user';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  fLogin: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.fLogin = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ],
      password: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
  }

  doLogin(){
    let loginWaiting = this.loadingCtrl.create({
      spinner: 'dots',
      content:"Loging in..."
    });
    let failedToast = this.toastCtrl.create({
      message: 'Login failed',
      duration: 3000,
      position: 'middle'
    });
    if(this.fLogin.valid){
      loginWaiting.present();
      this.userService.login(this.fLogin.value).then((success) => {
        loginWaiting.dismiss();
        this.navCtrl.setRoot(HomePage);
      }).catch(() => {
        loginWaiting.dismiss();
        loginWaiting.onDidDismiss(() => {
          failedToast.present();
        });
        this.navCtrl.setRoot(LoginPage);
      })
    }
  }
}
