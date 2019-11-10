import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'

import { NavbarComponent } from './navbar.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { CameraComponent } from '../camera/camera.component';
import { QueueComponent } from '../queue/queue.component';
import { OCR } from '@ionic-native/ocr/ngx';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { DatePipe } from '@angular/common';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  //student firestorage, vrs firestorage, camera location
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, QueueComponent, NavbarComponent, CameraComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [BarcodeScanner, Camera, OCR, AngularFireStorage, SplashScreen,
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
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
