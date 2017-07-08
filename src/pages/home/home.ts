import {Component} from '@angular/core';
import {NavController, AlertController, ToastController} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {edSecure} from '../../protection/secure';
import {SaleProvider} from '../../providers/sale/sale';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    stockList = [];

    orderlists = [];
    amounts: number[] = [];
    checkSale = false;

    /** calculate property */
    orderSum: number = 0;
    payment: number = 0;

    /** discount property */
    discount: number = 0;

    constructor(
      public navCtrl: NavController,
      private qrcodeScanner: BarcodeScanner,
      public  secure: edSecure,
      public alertCtrl: AlertController,
      public saleService: SaleProvider,
      public toastCtrl: ToastController
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
              let scanBook = JSON.parse(success.text);
              const id = this.secure.encrytionUser(scanBook.id);
              this.saleService.getBook(id).subscribe(success => {
                let stockBook = success;
                console.log(success);

                console.log(stockBook.quantity);
                if(stockBook.quantity > 0){
                  if(this.orderlists.length > 0){
                    for(let i=0 ; i < this.orderlists.length; i++){
                      if(this.orderlists[i].id = id){
                        this.orderlists[i].amount = Number.parseInt(this.orderlists[i].amount) + 1;
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
                  this.sumOrderList();
                }
              });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    dosale(){
      this.checkSale = true;
      this.qrScanner();
    }

  deleteCurrentOrder(index){
      this.orderlists.splice(index, 1);
  }

  cancleOrder(){
    this.orderlists = [];
    this.orderSum = 0;
    this.payment = 0;
    this.discount = 0;
    this.checkSale = false;
  }

  sumOrderList(){
    if(this.orderlists.length > 0){
      this.orderSum = 0;
      for(let i = 0; i < this.orderlists.length; i++){
        this.orderSum += Number.parseInt(this.orderlists[i].amount) + Number.parseInt(this.orderlists[i].price);
      }
      this.paymentCalculation();
    }
  }

  paymentCalculation(){
    if(this.orderSum > 0){
      this.payment = this.orderSum - (this.orderSum * this.discount);
    }
  }

  submitSale(){
    let confirm = this.alertCtrl.create({
      title:"Sale",
      message:"Are you sure?",
      buttons:[
        {
          text:"Cancle",
          handler:()=>{
          }
        },
        {
          text:"OK",
          handler:()=>{
            /** Sale code logic on fuction bellow*/
            this.submitedSale();
          }
        }
      ]
    })
    confirm.present();
  }

  submitedSale(){
    /** All sale code logic on this fuction */
    let successToast = this.toastCtrl.create({
      message: 'Succesfully',
      duration: 3000,
      position: 'top'
    });
    this.cancleOrder();
    successToast.present();
  }

}
