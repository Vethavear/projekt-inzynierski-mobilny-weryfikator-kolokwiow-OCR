import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';

import { Camera } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType } from '@ionic-native/ocr/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Base64ToGallery } from "@ionic-native/base64-to-gallery/ngx";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Camera,
    CameraPreview,
    ScreenOrientation,
    DeviceMotion,
    Diagnostic,
    Base64ToGallery,
    OCR,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
