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
    totalAmountSale: number = 0;

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
          this.checkSale = true;
          if ((success.text != '') || !success.cancelled) {
            try {
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
            }catch (e){
              if(this.orderlists.length < 1){
                this.checkSale = false;
              }
              console.log(e);
            }

          }else {
            if(this.orderlists.length < 1){
              this.checkSale = false;
            }
          }
        }).catch(error => {
            console.log(error);
        });
    }

    dosale(){
      this.qrScanner();
    }

  deleteCurrentOrder(index){
      this.orderlists.splice(index, 1);
      if(this.orderlists.length < 1){
        this.totalAmountSale = 0
        this.orderSum = 0;
        this.payment = 0;
        this.discount = 0;
        this.checkSale = false;
      }else{
        this.sumOrderList();
      }
  }

  cancleOrder(){
    this.orderlists = [];
    this.totalAmountSale = 0;
    this.orderSum = 0;
    this.payment = 0;
    this.discount = 0;
    this.checkSale = false;
  }

  sumOrderList(){
    if(this.orderlists.length > 0){
      this.totalAmountSale = 0;
      this.orderSum = 0;
      for(let i = 0; i < this.orderlists.length; i++){
        this.totalAmountSale += Number.parseFloat(this.orderlists[i].amount);
        this.orderSum += Number.parseFloat(this.orderlists[i].amount) * Number.parseFloat(this.orderlists[i].price);
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
    console.log(this.orderlists);
    let successToast = this.toastCtrl.create({
      message: 'Succesfully',
      duration: 3000,
      position: 'top'
    });
    successToast.present();
    successToast.onDidDismiss(() => {
      this.cancleOrder();
    });
  }

}
