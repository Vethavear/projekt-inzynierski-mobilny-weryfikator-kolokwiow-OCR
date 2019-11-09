import { TestBed, fakeAsync, async } from '@angular/core/testing';
import { StudentRelatedService } from '../student-related/student-related.service';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing'

import { VerifyingRelatedService } from './verifying-related.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { DatePipe } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OCR } from '@ionic-native/ocr/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Camera } from '@ionic-native/camera/ngx';

describe('VerifyingRelatedService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentRelatedService, BarcodeScanner, Camera, OCR, AngularFireStorage, SplashScreen,
        CameraPreview,
        ScreenOrientation,
        DeviceMotion,
        DatePipe,
        Platform,
        AndroidPermissions,
        Diagnostic,
        Network,
        OCR],
      imports: [RouterTestingModule, AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireDatabaseModule]
    });
  });

  //
  it('should be created', () => {
    const service = TestBed.get(VerifyingRelatedService);
    expect(service).toBeTruthy();
  });

  it('shouldn\'t assing data after wrong QR data format passed', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    const alert = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('wrongQRdata');
    expect(alert).toHaveBeenCalled();

  }));

  it('shouldn\'t assing data after correct format QR data passed but wrong first value', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    const alert = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('1234,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alert).toHaveBeenCalled();

  }));

  it('should assing data after correct QR data passed', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    // spy on alert method, if alert method triggers then something went wrong
    const alert = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('ABC,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alert).not.toHaveBeenCalled();

  }));


  it('should initialize current student grade and points with correct data from QR and OCR', (() => {
    console.log('should initialize cur...')
    const service = TestBed.get(VerifyingRelatedService);
    // spy on alert method, if alert method triggers then something went wrong
    const alertQr = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('ABC,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alertQr).not.toHaveBeenCalled();
    service.manipulateArr('1A2B3C');
    expect(alertQr).not.toHaveBeenCalled();
  }));

  it('should replace missing answers with N and then initialize current student grade and points with correct data from QR and repaired data from OCR', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    // spy on alert method, if alert method triggers then something went wrong
    const alertQr = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('ABC,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alertQr).not.toHaveBeenCalled();
    service.manipulateArr('123');
    expect(alertQr).not.toHaveBeenCalled();
  }));

  it('shouldn\'t initialize current student grade and points with correct data from QR and wrong from OCR', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    // spy on alert method, if alert method triggers then something went wrong
    const alertQr = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('ABC,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alertQr).not.toHaveBeenCalled();
    service.manipulateArr('1A2B3C4WROOOONG');
    expect(alertQr).toHaveBeenCalled();
  }));




});

