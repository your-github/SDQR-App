import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {edSecure} from '../../protection/secure';
@Injectable()
export class UserProvider {

  user: Observable<firebase.User>;
  db: FirebaseListObservable<any>;

  constructor(public http: Http, public firebasedb: AngularFireDatabase, public  secure: edSecure, public Auth: AngularFireAuth) {
    if (localStorage.getItem('sdqrusersession')) {
      const u = this.secure.encrytionUser(localStorage.getItem('sdqrusersession'));
      this.db = firebasedb.list('/dbook/users/' + u);
    }
    this.user = Auth.authState;
  }

  login(user: any) {
    const email = user.email;
    const password = user.password;
    return new Promise((resolve, reject) => {
      this.Auth.auth.signInWithEmailAndPassword(email, password).then((success) => {
        let token = success.uid + success.m;
        this.db = this.firebasedb.list('/dbook/users/' + token);
        token = this.secure.encrytionUser(token);
        localStorage.setItem('sdqrusersession', token);
        resolve(true);
      }).catch((err) => {
        reject(false);
      });
    })
  }



}
