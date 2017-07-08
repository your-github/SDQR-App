import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class SaleProvider {


  constructor(public http: Http, public firebasedb: AngularFireDatabase) {
  }

  getBook(key): FirebaseListObservable<any> {
    return this.firebasedb.list('/dbook/books/' + key);
  }

  updateStock(key, quantity) {
    return new Promise((resolve, reject) => {
      this.firebasedb.list('/dbook/books/').update(key, {quantity: quantity})
        .then((success: any) => {
          resolve(success);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  saleBook(saleData) {
    return new Promise((resolve, reject) => {
      this.firebasedb.list('/dbook/sales/').push(saleData).then((success: any) => {
        resolve(success);
      }).catch(error => {
        reject(error);
      })
    });
  }
}
