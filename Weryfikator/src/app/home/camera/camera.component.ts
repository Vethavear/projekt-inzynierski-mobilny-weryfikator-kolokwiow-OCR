
import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DOCUMENT } from '@angular/common';
import { CameraRelatedService } from '../services/camera-related/camera-related.service';
import { Router } from '@angular/router';
import { Base64ToGallery } from "@ionic-native/base64-to-gallery/ngx";
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})

export class CameraComponent implements OnInit {
  picture: string;
  cameraOpts: CameraPreviewOptions;
  cameraPictureOpts: CameraPreviewPictureOptions;
  imgtoShowDebug: any;

  constructor(
    public navCtrl: NavController,
    protected cameraPreview: CameraPreview,
    protected screenOrientation: ScreenOrientation,
    protected cs: CameraRelatedService,
    protected router: Router,
    public deviceMotion: DeviceMotion,
    public toastCtrl: ToastController,
    public base64ToGallery: Base64ToGallery) {

    this.cameraOpts = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      camera: 'rear',
      toBack: true
    };
    this.cameraPictureOpts = {
      width: window.innerWidth,
      height: window.innerHeight,
      quality: 100
    };

    this.startCamera();
  }

  async startCamera() {
    this.picture = null;
    const result = await this.cameraPreview.startCamera(this.cameraOpts);
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }


  public showOrientation() {
    this.getOrientation().then(result => {
      console.log(result);
      this.showToast(result, 1500, 'top');
    });
  }

  private getOrientation(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.deviceMotion.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) => {
          if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
            if (acceleration.x > 0) {
              resolve('landscape');
            } else {
              resolve('landscape-reversed');
            }
          } else {
            if (acceleration.y > 0) {
              resolve('portrait');
            } else {
              resolve('portrait-reversed');
            }
          }
        },
        (error: any) => reject(error)
      );
    });
  }

  private rotateImage(imageData, degrees): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      const image = new Image();

      image.src = 'data:image/jpeg;base64,' + imageData;

      image.onload = () => {

        if ((degrees / 90) % 2 === 0) {
          canvas.width = image.width;
          canvas.height = image.height;
        } else {
          canvas.width = image.height;
          canvas.height = image.width;
        }

        switch (degrees) {
          case 90:
            canvasContext.translate(canvas.width, 0);
            break;
          case 180:
            canvasContext.translate(canvas.width, canvas.height);
            break;
          case 270:
            canvasContext.translate(0, canvas.height);
            break;
        }

        canvasContext.rotate(degrees * Math.PI / 180);
        canvasContext.drawImage(image, 0, 0);
        resolve(canvas.toDataURL());
      };
    });
  }


  private prepareToCrop(imageData) {

    this.getOrientation().then(orientation => {

      if (orientation == 'portrait') {
        this.cropPicture(imageData);
      } else {
        let rotation;
        if (orientation == 'landscape') {
          rotation = 270;
        } else if (orientation == 'portrait-reversed') {
          rotation = 180;
        } else {
          rotation = 90;
        }
        this.rotateImage(imageData, rotation).then(rotatedImg => {
          this.cropPicture(rotatedImg);
        });
      }
    });
  }

  private async showToast(message: string, duration: number, position) {
    (await this.toastCtrl.create({
      message,
      duration,
      position
    })).present();
  }

  async takePicture() {
    const result = await this.cameraPreview.takePicture(this.cameraPictureOpts);
    await this.cameraPreview.stopCamera();
    this.picture = 'data:image/jpeg;base64,' + result;
    this.prepareToCrop(this.picture);

    // this.cameraPreview.stopCamera();
    // document.getElementById('ioncontent').classList.remove('clearBg');
  }


  cropPicture(picture: string) {

    const rectangle = document.getElementById('aim');
    const rectangleCoordinates = rectangle.getBoundingClientRect();
    const x = rectangleCoordinates.left;
    const y = rectangleCoordinates.top;
    const rect_width = rectangle.offsetWidth;
    const rect_height = rectangle.offsetHeight;
    const image = new Image();

    // image will contain CROPPED image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    image.src = picture;
    image.onload = async () => {

      // Required to interpolate rectangle(from screen) into original image
      const x_axis_scale = image.width / window.screen.width;
      const y_axis_scale = image.height / window.screen.height;

      // INTERPOLATE
      const x_coord_int = x * x_axis_scale;
      const y_coord_int = y * y_axis_scale;
      const rect_width_int = rect_width * x_axis_scale;
      const rect_height_int = rect_height * y_axis_scale;
      // Set canvas size equivalent to interpolated rectangle size
      canvas.width = rect_width_int;
      canvas.height = rect_height_int;

      ctx.drawImage(image,
        x_coord_int, y_coord_int,           // Start CROPPING from x_coord(interpolated) and y_coord(interpolated)
        rect_width_int, rect_height_int,    // Crop interpolated rectangle
        0, 0,                               // Place the result at 0, 0 in the canvas,
        rect_width_int, rect_height_int);   // Crop interpolated rectangle

      // Get base64 representation of cropped image
      const cropped_img_base64 = canvas.toDataURL();
      this.base64ToGallery.base64ToGallery(cropped_img_base64.toString()).then(async path => {
        console.log('sceizka do pliku:');
        console.log(path);
        this.cs.capturedSnapURL = this.cs.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc(path);
        await this.cs.doOcr(path);
        this.goBack();
      }).catch(err => {
        console.log('Nie udalo sie zapisac pliku');
      });
      // return cropped_img_base64;
      // this.imgtoShowDebug = (<any>window).Ionic.WebView.convertFileSrc(cropped_img_base64);

    };
  }

  goBack() {
    this.router.navigate(['']);
  }

  async lockView() {
    await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ngOnInit() {
    this.lockView();
  }

}


