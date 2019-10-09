import { Component } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner

} from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { ToastController } from '@ionic/angular';
import { logging, element } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  scanResult: string;
  licznikWyrazow: number;
  rozdziel: string[];
  // niechcianeZnaki: string[];
  usunKlamry: string;
  wynik: string;

  capturedSnapURL: string;

  cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
     cameraDirection: 1,
     correctOrientation: true
  };
  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera, private ocr: OCR, private toastController: ToastController) {
    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        alert('Barcode data ' + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {

      this.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc(imageData);
     

      this.ocr.recText(0, imageData)
        .then((res: OCRResult) => this.verifyAnswers((JSON.stringify(res.lines.linetext))))

        .catch((error: any) => console.error(error));


    }, (err) => {

      console.log(err);
      // Handle error
    });

    this.presentToastWithOptions();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Imie i Nazwisko',
      message: 'Wynik',
      position: 'bottom',
      buttons: [
        {
          side: 'start',
          icon: 'checkbox-outline',
          text: 'Zapisz ocene',
          handler: () => {
            // dodać obsługę i do firestora cyk
            console.log('Zapisano ocene');
          }
        }, {
          text: 'Cofnij',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }


  verifyAnswers(skan: string) {
    this.scanResult = skan;

    this.usunKlamry = this.scanResult.slice(1, this.scanResult.length - 1);
    this.rozdziel = this.usunKlamry.split('').filter(element => element != '"' && element != ',');
    this.wynik = this.rozdziel.join('');


    // document.getElementById('elo').textContent = this.rozdziel[0];

    //   for (let index = 0; index < this.scanResult.length; index++) {

    //     console.this.scanResult[0]
    //  }

  }



}
