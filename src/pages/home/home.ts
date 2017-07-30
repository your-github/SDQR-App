import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, ToastController, LoadingController, Events} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {edSecure, roundNumber} from '../../protection/secure';
import {SaleProvider} from '../../providers/sale/sale';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  implements OnInit{

  orderlists = [];                            // Declare to store sale list as a cart
  amounts: number[] = [];                     // Declare to loop amount on amount input
  checkSale = false;                          // Check right logic for exist order in the cart or not

  /** calculate property */
  orderSum: number = 0;                       // Summary all money of cart not including discount
  payment: number = 0;                        // Summary payment
  totalAmountSale: number = 0;                // Sumary all books of ordering

  /** discount property */
  discount: number = 0;                       // Store discount (Percent)
  currentAmount: number = 0;                  // store current amount when click on amount input to change amount
  checkScan = false;                          // Check right logic for scan to change amount and click on amount input to change amount

  constructor(
    public navCtrl: NavController,
    private qrcodeScanner: BarcodeScanner,
    public  secure: edSecure,
    public alertCtrl: AlertController,
    public saleService: SaleProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events
  ) {
    for (let i = 1; i < 31; i++) {
      this.amounts[i - 1] = i;
    }
    this.events.publish('showUser');
  }
  ngOnInit() {

  }
  /** Do scanning method for preparing to order*/
  qrScanner() {

    /** Set option for the scanner*/
    const option: BarcodeScannerOptions = {
      'preferFrontCamera': false,
      'showFlipCameraButton': true,
      'showTorchButton': true,
      'formats': 'QR_CODE'
    }

    /** Scanning QR code */
    this.qrcodeScanner.scan(option).then(success => {

      /**
       If scan text is not empty and scan is not cancle do the right logic else check order list, if no data in the list
       set checkSale property to false to hide order list template
       */
      if ((success.text != '') || !success.cancelled) {

        /**
         * Use try-catch to check right format of our QR code (If scan text can convert to json format data is OK else
         * check order list, if no data in the list set checkSale property to false to hide order list template )
         */
        try {
          let scanBook = JSON.parse(success.text);                                        //Convert scan text to json format
          const id = this.secure.encrytionUser(scanBook.id);                              //Decryption book key (Book id)

          /** Get book details from firebase database */
          this.saleService.getBook(id).then(success => {
            let stockBook = success;
            /** If quantity in stock are more than 0 do order else do check if exist book on the order list delete it */
            if (Number.parseInt(stockBook.quantity) > 0) {
              this.checkSale = true;                                                //Set checkSale property to true to show order list template

              /**
               * Check Order list (Cart): if exist data on order list (Cart) loop to compare current scanning book with exist books
               * if there are current scanning book on the list increment a book for it else add new book to order list
               */
              if (this.orderlists.length > 0) {
                let count = 0;                                                                    //Declare count to check exist book on the list
                for (let i = 0; i < this.orderlists.length; i++) {
                  if (this.orderlists[i].id == id) {
                    count += 1;
                    if (stockBook.quantity - Number.parseInt(this.orderlists[i].amount) > 0) {
                      this.checkScan = true;
                      this.orderlists[i].amount = Number.parseInt(this.orderlists[i].amount) + 1;
                      break;
                    } else {
                      let warnningToast = this.toastCtrl.create({
                        message: 'Book is not enough',
                        duration: 3000,
                        position: 'top'
                      });
                      warnningToast.present();
                    }
                  }
                }

                /** Check count if count more than 0 don't add new book to list because the scanning book is exist on the order list */
                if (count == 0) {

                  let import_price = this.secure.decrytionNumber(scanBook.ip);        // Decryption import price
                  scanBook.id = id;                                                   // Store Decryption ID change encyption
                  scanBook.name = stockBook.bname;                                    // Store book name that respone from database
                  scanBook.ip = Number.parseInt(import_price);                        // Store import decryption price change encryption price
                  scanBook.amount = 1;                                                // Set amount to 1 for new order book

                  /** Add new scanning book to order list (cart)*/
                  this.orderlists.push(scanBook);
                }
              } else {
                let import_price = this.secure.decrytionNumber(scanBook.ip);           // Decryption import price
                scanBook.id = id;                                                       // Store Decryption ID change encyption
                scanBook.name = stockBook.bname;                                        // Store book name that respone from database
                scanBook.ip = Number.parseInt(import_price);                            // Store import decryption price change encryption price
                scanBook.amount = 1;                                                    // Set amount to 1 for new order book

                /** Add new scanning book to order list (cart)*/
                this.orderlists.push(scanBook);
              }
              this.sumOrderList();
            }else {

              /** Set toast message */
              let warnningToast = this.toastCtrl.create({
                message: 'No book in stock',
                duration: 3000,
                position: 'top'
              });

              /** When toast message is already close */
              warnningToast.onDidDismiss(() => {

                /** if there are book on the list loop to compare book if there is exist the scanning book on the order list delete it */
                if (this.orderlists.length > 0) {                                                                  //Declare count to check exist book on the list
                  for (let i = 0; i < this.orderlists.length; i++) {
                    if (this.orderlists[i].id == id) {
                      this.deleteCurrentOrder(i);
                      break;
                    }
                  }
                }
              });

              /** Show toast messsage */
              warnningToast.present();
            }
          });
        } catch (e) {
          if (this.orderlists.length < 1) {
            this.checkSale = false;
          }
          console.log(e);
        }

      } else {
        if (this.orderlists.length < 1) {
          this.checkSale = false;
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /** Delete Order book from the list */
  deleteCurrentOrder(index) {
    this.orderlists.splice(index, 1);             // Delete current order book using slice function

    /** Check if no data in the order list set all property to default else Sumary money again */
    if (this.orderlists.length < 1) {
      this.totalAmountSale = 0
      this.orderSum = 0;
      this.payment = 0;
      this.discount = 0;
      this.checkSale = false;
    } else {
      this.sumOrderList();
    }
  }

  /** Cancle current order mathod ( Set all property to defualt )*/
  cancleOrder() {
    this.orderlists = [];
    this.totalAmountSale = 0;
    this.orderSum = 0;
    this.payment = 0;
    this.discount = 0;
    this.checkSale = false;
  }

  /** save current amount of books to a property when clicking on a amount input of books */
  saveCurrentAmount(index) {
    this.currentAmount = this.orderlists[index].amount;
  }

  /** check current amount of books method*/
  checkAmount(index) {
    /**
     * if the change of amount is from scanning don't do anything else check enough quantity from store
     * (If part is amount change from scanning and Else part is amount change from amount input)
     * */
    if(this.checkScan){
      this.checkScan = false;
      return;
    }else {

      /** Get book details from database of current amount change */
      this.saleService.getBook(this.orderlists[index].id).then(success => {
      let stockBook = success;

      /** If quantity is more than 0 do right logic else delete it from the order list */
      if (Number.parseInt(stockBook.quantity) > 0) {

        /** If order amount is not enough set amount to before change else not do anything */
        if (stockBook.quantity - Number.parseInt(this.orderlists[index].amount) < 0) {
          let warnningToast = this.toastCtrl.create({
            message: 'Book is not enough. Maximum in stock ' + stockBook.quantity,
            duration: 2000,
            position: 'top'
          });
          warnningToast.present();
          warnningToast.onWillDismiss(() => {
            this.orderlists[index].amount = this.currentAmount;
          });
        }

      } else {
        let warnningToast = this.toastCtrl.create({
          message: 'No book in stock',
          duration: 3000,
          position: 'top'
        });
        warnningToast.onDidDismiss(() => {

          /** Delete book */
          this.deleteCurrentOrder(index);
        });
        warnningToast.present();
      }

      /** Summary money again */
      this.sumOrderList();
    });
    }
  }

  /** Summary money of order list method */
  sumOrderList() {
    if (this.orderlists.length > 0) {
      this.totalAmountSale = 0;                 //Set totalAmountSale property to default
      this.orderSum = 0;                        // Set orderSum property to default

      /** Loop to summary money of order list ( Cart )*/
      for (let i = 0; i < this.orderlists.length; i++) {
        this.totalAmountSale += Number.parseFloat(this.orderlists[i].amount);
        this.orderSum += Number.parseFloat(this.orderlists[i].amount) * Number.parseFloat(this.orderlists[i].price);
      }

      /** Calculation payment including discount */
      this.paymentCalculation();
    }
  }

  /** Calculation payment method */
  paymentCalculation() {
    if (this.orderSum > 0) {
      this.payment = roundNumber.roundPrice((this.orderSum - (this.orderSum * this.discount)));
    }
  }

  /** Summit sale method */
  submitSale() {

    /** Set confirm dialog option to make sure */
    let confirm = this.alertCtrl.create({
      title: "Sale",
      message: "Are you sure?",

      /** Cancle logic */
      buttons: [
        {
          text: "Cancle",
          handler: () => {
          }
        },

        /** OK logic */
        {
          text: "OK",
          handler: () => {
            /** Sale code logic on fuction bellow*/
            this.submitedSale();
          }
        }
      ]
    });

    /** Show dialog */
    confirm.present();
  }

  /** All sale code logic on this method */
  submitedSale() {
    let saleCount = 0;                               //Set sale count to check when save all order list done

    let responeMessage = 'Successfully';
    /** Set waiting option when click Ok button of confirm dialog */
    let saveWaiting = this.loadingCtrl.create({
      spinner: 'dots',
      content: "Saving..."
    });
    saveWaiting.onDidDismiss(() => {
      successToast.present();
    })

    /** Set successfully toast option */
    let successToast = this.toastCtrl.create({
      message: responeMessage,
      duration: 3000,
      position: 'top'
    });
    successToast.onDidDismiss( () => {
      this.cancleOrder();
    })
    saveWaiting.present();
    new Promise((resolve, reject) => {
      const sDateTime = new Date();
      const user = this.secure.encrytionUser(localStorage.getItem('sdqrusersession'));

      let newlist = new Array();
      newlist = this.orderlists;
      newlist.map(currentOrder => {

        this.saleService.getBook(currentOrder.id).then(success => {
          let stockBook = success;
          if (Number.parseInt(stockBook.quantity) > 0) {
            const updateQuantity = stockBook.quantity - Number.parseInt(currentOrder.amount)
            if (updateQuantity >= 0) {
              this.saleService.updateStock(currentOrder.id, updateQuantity).then(() => {
                const total = roundNumber.roundPrice((Number.parseFloat(currentOrder.price) * Number.parseInt(currentOrder.amount) - Number.parseFloat(currentOrder.price) * Number.parseInt(currentOrder.amount) * this.discount));
                const principle = Number.parseFloat(currentOrder.ip) * Number.parseInt(currentOrder.amount);
                const saleList = {
                  usertk: user,
                  id: currentOrder.id,
                  name: currentOrder.name,
                  iprice: Number.parseInt(currentOrder.ip),
                  eprice: Number.parseInt(currentOrder.price),
                  amount: Number.parseInt(currentOrder.amount),
                  discount: this.discount,
                  sDate: sDateTime.getFullYear() + '-' + (sDateTime.getMonth() + 1) + '-' + sDateTime.getDate(),
                  principle: principle,
                  total: total,
                  profit: total - principle
                }
                this.saleService.saleBook(saleList).then(() => {
                  saleCount += 1;
                  if(saleCount == newlist.length){
                    resolve(true);
                  }
                }).catch(() => {
                  reject(false);
                });
              }).catch(() => {
                reject(false);
              });
            }
          }
        }, () => {
          reject(false);
        });

      });
    }).then((success) => {
      saveWaiting.dismiss();
    }).catch(error => {
      responeMessage = 'Failed saving sale list'
      saveWaiting.dismiss();
    });
  }

}
