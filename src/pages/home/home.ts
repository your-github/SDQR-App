import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    orderlists = [];
    qty = 1;
    disc = 0;

    constructor(public navCtrl: NavController, private qrcodeScanner: BarcodeScanner) {

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
                this.orderlists.push(success);
                console.log(success);
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
}
