import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class SaleProvider {


    constructor(public http: Http, public firebasedb: AngularFireDatabase) {
    }

    getBook(key): any {
        return new Promise((resolve, reject) => {
          this.firebasedb.object('/dbook/books/' + key).subscribe(success => {
            resolve(success);
          }, err => {
            reject(err);
          });
        });
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
