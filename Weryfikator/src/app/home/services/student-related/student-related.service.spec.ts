import { TestBed } from '@angular/core/testing';
import { Camera } from '@ionic-native/camera/ngx';

import { StudentRelatedService } from './student-related.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Network } from '@ionic-native/network/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { DatePipe } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OCR } from '@ionic-native/ocr/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('StudentRelatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireDatabaseModule],
    providers: [AngularFireStorage, BarcodeScanner, Camera, OCR, AngularFireStorage, SplashScreen,
      CameraPreview,
      ScreenOrientation,
      DeviceMotion,
      DatePipe,
      Platform,
      AndroidPermissions,
      Diagnostic,
      Network,
      OCR]
  }));

  it('should be created', () => {
    const service: StudentRelatedService = TestBed.get(StudentRelatedService);
    expect(service).toBeTruthy();
  });
});
