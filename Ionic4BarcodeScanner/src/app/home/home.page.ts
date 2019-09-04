import { Component } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  data: string;
  message: string;
  encodedData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera) {

    this.encodedData = 'https://www.FreakyJolly.com';
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

  encodedText() {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodedData).then((encodedData) => {
      console.log(encodedData);
      this.encodedData = encodedData;
    }, (err) => {
      console.log('Error occured : ' + err);
    });
  }

  makePhoto() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
    }
}
