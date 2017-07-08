import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {edSecure} from '../../protection/secure';
import {SaleProvider} from '../../providers/sale/sale';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    orderlists = [];
    amounts: number[] = [];
    disc = 0;
    checkSale = false;

    constructor(
      public navCtrl: NavController,
      private qrcodeScanner: BarcodeScanner,
      public  secure: edSecure,
      public alertCtrl: AlertController,
      public saleService: SaleProvider
    ) {
      for(let i = 1; i < 31; i++){
        this.amounts[i - 1] = i;
      }
    }

    qrScanner() {
        const option: BarcodeScannerOptions = {
            'preferFrontCamera': false,
            'showFlipCameraButton': true,
            'showTorchButton': true,
            'formats': 'QR_CODE'
        }
        this.qrcodeScanner.scan(option).then(success => {
            if ((success.text != '') || !success.cancelled) {
              try {
                let scanBook = JSON.parse(success.text);
                const id = this.secure.encrytionUser(scanBook.id);
                console.log(id);
                this.saleService.getBook(id).subscribe(success => {
                  console.log(success);
                  let stockBook = success;
                  if(stockBook.quantity > 0){
                    if(this.orderlists.length > 0){
                      for(let i=0 ; i < this.orderlists.length; i++){
                        if(this.orderlists[i].id = id){
                          this.orderlists[i].quantity = this.orderlists[i].quantity + 1;
                          break;
                        }
                      }
                    }else {
                      let import_price = this.secure.decrytionNumber(scanBook.ip);
                      scanBook.id = id;
                      scanBook.name = stockBook.bname;
                      scanBook.ip = import_price;
                      scanBook.amount = 1;

                      /*store scan book to cart*/
                      this.orderlists.push(scanBook);
                    }
                  }
                });
              }catch (e){
                console.log(e);
              }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    changeAmount(am, index) {
      console.log(this.orderlists[index]);
    }

    discount(disc) {
        console.log(disc);
    }
    dosale(){
        this.checkSale = true;
    }

  deleteCurrentOrder(index){
      this.orderlists.splice(index, 1);
  }
}
