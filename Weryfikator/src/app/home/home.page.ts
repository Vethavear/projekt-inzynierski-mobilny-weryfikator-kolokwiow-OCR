import { Component } from "@angular/core";
import {
  BarcodeScannerOptions,
  BarcodeScanner

} from "@ionic-native/barcode-scanner/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  capturedSnapURL:string;
 
  cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  constructor(private barcodeScanner: BarcodeScanner, private camera: Camera) {
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        alert("Barcode data " + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      // this.camera.DestinationType.FILE_URI gives file URI saved in local
      // this.camera.DestinationType.DATA_URL gives base64 URI
      
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.capturedSnapURL = base64Image;
    }, (err) => {
      
      console.log(err);
      // Handle error
    });
  }
 
 
}