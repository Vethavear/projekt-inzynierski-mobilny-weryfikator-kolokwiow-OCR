import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { VerifyingRelatedService } from '../verifying-related/verifying-related.service';


@Injectable({
  providedIn: 'root'
})
export class CameraRelatedService {
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  scanResult;
  capturedSnapURL: string;


  cameraOptions: CameraOptions = {
    sourceType: 0,
    quality: 20,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: 1,
    correctOrientation: true
  };
  scanResultBlock: string[];
  scanResultLines: any;
  scanResultWords: string;
  scanResultBlockSingleString: string;

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
        alert('Barcode data ' + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
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
    //zmien tego strtinga pozniej
    // jedna linia
    this.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc
      ('file:///storage/emulated/0/Android/data/io.ionic.starter/cache/20191028_110853.jpg?1572257559352');
    this.ocr.recText(0, 'file:///storage/emulated/0/Android/data/io.ionic.starter/cache/20191028_110853.jpg?1572257559352')
      //dwie linie
      // this.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc
      // ('file:///storage/emulated/0/Android/data/io.ionic.starter/cache/20191028_145323.jpg?1572270899643');
      // this.ocr.recText(0, 'file:///storage/emulated/0/Android/data/io.ionic.starter/cache/20191028_145323.jpg?1572270899643')
      //default capture
      //this.ocr.recText(0, image)
      .then((res: OCRResult) => {
        this.scanResultBlock = res.blocks.blocktext;
        this.scanResultBlockSingleString = this.scanResultBlock.join(' ');
        this.scanResultBlockSingleString = this.scanResultBlockSingleString.replace(' ', '');
        this.scanResultLines = res.lines.linetext;
        this.scanResultWords = res.words.wordtext.join('');


      })
      .catch((error: any) => console.error(error));

    VerifyingRelatedService.verifyAnswers('a', 'b');
  }








}
