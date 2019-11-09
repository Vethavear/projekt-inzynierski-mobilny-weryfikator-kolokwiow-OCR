import { TestBed } from '@angular/core/testing';

import { CameraRelatedService } from './camera-related.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OCR } from '@ionic-native/ocr/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Network } from '@ionic-native/network/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { DatePipe } from '@angular/common';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('CameraRelatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CameraRelatedService, BarcodeScanner, Camera, OCR, AngularFireStorage, SplashScreen,
      CameraPreview,
      ScreenOrientation,
      DeviceMotion,
      DatePipe,
      Platform,
      AndroidPermissions,
      Diagnostic,
      Network,
      OCR,],
    imports: [RouterTestingModule, AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireDatabaseModule]
  }));

  it('should be created', () => {
    const service: CameraRelatedService = TestBed.get(CameraRelatedService);
    expect(service).toBeTruthy();
  });
});
