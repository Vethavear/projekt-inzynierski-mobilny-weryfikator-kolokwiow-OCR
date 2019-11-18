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
    service.correctDataFromOCR('1A2B3C');
    expect(alertQr).not.toHaveBeenCalled();
  }));

  it('should replace missing answers with N and then initialize current student grade and points with correct data from QR and repaired data from OCR', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    // spy on alert method, if alert method triggers then something went wrong
    const alertQr = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]

    service.prepareBarcodeData('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alertQr).not.toHaveBeenCalled();
    // 1A2B3DA5C6B7D8A1011B12A13C1415A16C17B18D19B20A21D22A23C24B2526A27B28C29D3031A32B33343536A37A38D39A40B - done
    // 1A2B3D4A56B7D89A10C11B12A13C14C15A16C17B18D19B20AA21D22A2324B2526A27B28C29D3031A32B333435C36A37A38D3940B - done
    // 1A2B3D4A5C6B7D811B12A131415A16C17B18D19B20A21D22A23C24B2526A2728C29309A1031A32333435C36A37A38D39A40B - unrepairable, cause: 7D811B 
    // 1A2B3D4A56B7D89A10C11B12A13C14C15A16C17B18D19B20A21D22A2324B2526A2728C29D30C31A32B3334B3636A37438D3940B - tbd
    service.correctDataFromOCR('1A2B3D4A56B7D89A10C11B12A13C14C15A16C17B18D19B20A21D22A2324B2526A2728C29D30C31A32B3334B3636A37438D3940B');
    expect(alertQr).not.toHaveBeenCalled();
  }));

  it('shouldn\'t initialize current student grade and points with correct data from QR and wrong from OCR', (() => {
    const service = TestBed.get(VerifyingRelatedService);
    // spy on alert method, if alert method triggers then something went wrong
    const alertQr = spyOn(service, 'presentAlert').and.callThrough();
    // we're expecting string that could be formatted this way:  odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    service.prepareBarcodeData('ABC,100440,grupa2,Adrian,Bury,AplikacjeInternetowe');
    expect(alertQr).not.toHaveBeenCalled();
    service.correctDataFromOCR('1A2B3C4WROOOONG');
    expect(alertQr).toHaveBeenCalled();
  }));




});

