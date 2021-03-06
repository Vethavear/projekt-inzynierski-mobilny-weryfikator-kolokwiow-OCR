import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { VerifyingRelatedService } from '../verifying-related/verifying-related.service';
import * as CryptoJS from 'crypto-js';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CameraRelatedService {
  dataFromQr: string;
  flash;
  brightness = 0;
  contrast: 0;
  cameraOptions: CameraOptions = {
    // gallery is  0, camera is 1
    sourceType: 0,
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: 1,
    correctOrientation: true,
  };
  barcodeScannerOptions: BarcodeScannerOptions = {
    showTorchButton: true,
    showFlipCameraButton: true
  };
  scanResultWords: string[];

  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera,
    private ocr: OCR, public alertController: AlertController,
    public router: Router,
    public vrs: VerifyingRelatedService) {
    // Options


  }

  scanQr() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        try {
          const bytes = CryptoJS.AES.decrypt(barcodeData.text, 'testmaker-inz');
          if (bytes.toString()) {
            this.dataFromQr = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            this.vrs.prepareBarcodeData(this.dataFromQr);
            console.log(this.dataFromQr);
            console.log(this.vrs.qrScanned);
            this.vrs.qrScanned = true;
          }
        } catch (e) {
          this.presentAlertQr();
          console.log(e);
        }
      })
      .catch(err => {
        console.log('Error', err);
        this.presentAlertQr();
      });
  }

  async takeSnap() {
    // backup function if somehow Camera Component would stop working. It is just calling device native camera.
    await this.camera.getPicture(this.cameraOptions).then((imageData) => {
      // sciezka do zapisanych zdjec
      console.log(imageData);
      this.doOcr(imageData);
    }, (err) => {
      console.log(err);
    });
  }

  async doOcr(image) {
    this.scanResultWords = [];
    this.ocr.recText(0, image)
      .then((res: OCRResult) => {
        this.scanResultWords = res.words.wordtext;
        this.vrs.correctDataFromOCR(this.scanResultWords.toString());
      })
      .catch(async (error: any) => {
        this.presentAlertOcr();
        console.error(error);
      });
  }

  async presentAlertOcr() {
    const alert = await this.alertController.create({
      header: 'Błąd!',
      message: 'Message <strong>Ocr nie wykrył tekstu, zrób inne zdjęcie</strong>!!!',
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Zrób zdjęcie',
          handler: () => {
            this.router.navigateByUrl('/home/camera');
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertQr() {
    const alert = await this.alertController.create({
      header: 'Błąd!',
      message: 'Message <strong>QR nie odszyfrował odpowiedzi. Spróbuj jeszcze raz</strong>!!!',
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Skan QR',
          handler: () => {
            this.scanQr();
          }
        }
      ]
    });

    await alert.present();
  }
}
