import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {edSecure} from '../../protection/secure';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    orderlists = [];
    qty = 1;
    disc = 0;
    checkSale = false;
    constructor(public navCtrl: NavController, private qrcodeScanner: BarcodeScanner,public  secure: edSecure, public alertCtrl: AlertController) {

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
                const book = JSON.parse(success.text);
                this.orderlists.push(book);
              /*console.log(success);*/
            }
        }).catch(error => {
            console.log(error);
        });
    }

    valueChange() {
        console.log(this.qty);
    }

    discount(disc) {
        console.log(disc);
    }
    dosale(){
        this.checkSale = true;
    }
}
