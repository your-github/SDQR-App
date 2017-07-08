import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    public formBuilder: FormBuilder
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
    if(this.fLogin.valid){
      this.userService.login(this.fLogin.value).then(() => {
        this.navCtrl.setRoot(HomePage);
      }).catch(() => {
        this.navCtrl.setRoot(LoginPage);
      })
    }
  }
}
