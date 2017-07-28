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
    this.user = Auth.authState;
  }

  getUser() {
    return new Promise((resolve, reject)=>{
      if (localStorage.getItem('sdqrusersession')) {
        const u = this.secure.encrytionUser(localStorage.getItem('sdqrusersession'));
        this.db = this.firebasedb.list('/dbook/users/' + u);
        this.db.subscribe((success) => {
          resolve(success[0]);
        }, err => {
          reject(err);
        })
        //console.log(this.db);

      }
      else {
        reject(false);
      }
    });
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

  logout(){
    return new Promise((resolve, reject) => {
      this.Auth.auth.signOut().then(() => {
        localStorage.removeItem('sdqrusersession');
        resolve(true);
      }).catch(() => {
        reject(false);
      })
    });
  }

}
