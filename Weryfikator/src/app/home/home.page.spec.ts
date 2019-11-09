import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { HomePage } from './home.page';
import { SettingsComponent } from './settings/settings.component';
import { StudentComponent } from './student/student.component';
import { QueueComponent } from './queue/queue.component';
import { InstructionComponent } from './instruction/instruction.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CameraComponent } from './camera/camera.component';
import { CameraRelatedService } from './services/camera-related/camera-related.service';
import { VerifyingRelatedService } from './services/verifying-related/verifying-related.service';
import { StudentRelatedService } from './services/student-related/student-related.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppComponent } from '../app.component';
import { AppRoutingModule } from '../app-routing.module';
import { Network } from '@ionic-native/network/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/';
import { Camera } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType } from '@ionic-native/ocr/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage, NavbarComponent, QueueComponent, InstructionComponent, CameraComponent, StudentComponent, SettingsComponent],
      providers: [CameraRelatedService, VerifyingRelatedService, StudentRelatedService, ScreenOrientation, StatusBar,
        SplashScreen,
        BarcodeScanner,
        Camera,
        CameraPreview,
        ScreenOrientation,
        DeviceMotion,
        AngularFireStorage,
        DatePipe,
        Platform,
        AndroidPermissions,
        Diagnostic,
        Network,
        OCR,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
      imports: [IonicModule.forRoot(), RouterTestingModule, CommonModule,
        FormsModule,
        IonicModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule,
      AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireDatabaseModule],

    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
