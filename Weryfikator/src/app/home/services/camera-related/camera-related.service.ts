import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { VerifyingRelatedService } from '../verifying-related/verifying-related.service';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CameraRelatedService {
  scannedData: string;
  barcodeScannerOptions: BarcodeScannerOptions;
  scanResult;
  capturedSnapURL: string;
  qrScanned = false;

  cameraOptions: CameraOptions = {
    //galeria to 0, camera to 1
    sourceType: 1,
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: 1,
    correctOrientation: true
  };
  scanResultBlock: string[];
  scanResultLines: any;
  scanResultWords: string[];
  scanResultBlockSingleString: string;
  rotatedImg: any;
  originalPicture: string;

  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera, private ocr: OCR) {
    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanQr() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        try {
          const bytes = CryptoJS.AES.decrypt(barcodeData.text, 'karakan123');
          if (bytes.toString()) {
            this.scannedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            this.qrScanned = true;
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  async takeSnap() {
    await this.camera.getPicture(this.cameraOptions).then((imageData) => {
      //sciezka do zapisanych zdjec
      console.log(imageData);
      this.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      this.doOcr(imageData);
    }, (err) => {
      console.log(err);
    });
  }

  async doOcr(image) {
    this.scanResultWords = [];
    this.ocr.recText(0, image)
      .then((res: OCRResult) => {
        // this.scanResultBlock = res.blocks.blocktext;
        // this.scanResultBlockSingleString = this.scanResultBlock.join(' ');
        // this.scanResultBlockSingleString = this.scanResultBlockSingleString.replace(' ', '');
        // this.scanResultLines = res.lines.linetext;
        // this.scanResultWords = res.words.wordtext.join('');

        this.scanResultWords = res.words.wordtext;
        // VerifyingRelatedService.prepareBarcodeData(this.scannedData);
        VerifyingRelatedService.manipulateArr(this.scanResultWords.toString());
      })
      .catch((error: any) => console.error(error));
  }

}
