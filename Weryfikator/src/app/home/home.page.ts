import { Component } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner

} from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr/ngx';
import { ToastController } from '@ionic/angular';
import { Student } from '../student/student';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  scanResult;
  capturedSnapURL: string;
  students: Student[];

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
  scanResultWords: string[];
  scanResultBlockSingleString: string;

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

  async takeSnap() {
    await this.camera.getPicture(this.cameraOptions).then((imageData) => {

      this.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      this.doOcr(imageData);
    }, (err) => {
      console.log(err);
    });
  }

  async doOcr(image) {
    //zmien tego strtinga pozniej
    this.ocr.recText(0, 'file:///storage/emulated/0/Android/data/io.ionic.starter/cache/20191028_110853.jpg?1572257559352')
      .then((res: OCRResult) => this.verifyAnswers(res, this.scannedData))
      .catch((error: any) => console.error(error));
  }




  verifyAnswers(result, goodAnswers) {
    //karta dwuliniowa QR
    this.scannedData = 'AAABBBCAACCABBBDABCD';
    // karta jednoliniowa
    // this.scannedData=
    this.scanResultBlock = result.blocks.blocktext;
    this.scanResultBlockSingleString = this.scanResultBlock.join(' ');
    this.scanResultBlockSingleString = this.scanResultBlockSingleString.replace(' ', '');

    this.scanResultLines = result.lines.linetext;

    this.scanResultWords = result.words.wordtext.join('');

    // algorytm to sprawdzania ile jest pytan

    //array.length/2 powinien zwrocic liczbe pytan. Dodatkowo, od razu sprawdzic czy liczba jest parzysta. Jak nie parzysta - powtórz skan!








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





}
