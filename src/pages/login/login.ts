import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
    public loadingCtrl: LoadingController
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
      content:"Loging in..."
    });
    if(this.fLogin.valid){
      loginWaiting.present();
      this.userService.login(this.fLogin.value).then(() => {
        loginWaiting.dismiss();
        this.navCtrl.setRoot(HomePage);
      }).catch(() => {
        loginWaiting.dismiss();
        this.navCtrl.setRoot(LoginPage);
      })
    }
  }
}
