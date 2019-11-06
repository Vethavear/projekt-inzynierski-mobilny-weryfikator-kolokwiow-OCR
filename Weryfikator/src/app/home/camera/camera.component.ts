
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { CameraRelatedService } from '../services/camera-related/camera-related.service';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
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
  viewChanged = false;
  deviceMotionSubscribe;
  constructor(
    public navCtrl: NavController,
    protected cameraPreview: CameraPreview,
    protected screenOrientation: ScreenOrientation,
    protected cs: CameraRelatedService,
    protected router: Router,
    public deviceMotion: DeviceMotion,
    public diagnostic: Diagnostic) {

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
  }

  async startCamera() {
    this.picture = null;
    const result = await this.cameraPreview.startCamera(this.cameraOpts);
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  private changeCameraToMatchCurrOrientation(viewChanged: boolean) {
    this.deviceMotionSubscribe = this.deviceMotion.watchAcceleration({ frequency: 200 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        const cameraIcon = document.getElementById('cameraIcon');
        if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
          if (acceleration.x > 0) {
            console.log('landscape');
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
            cameraIcon.classList.add('rotate90');
          } else {
            console.log('landscape-reversed');
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
            cameraIcon.classList.add('rotate-90');

          }
        } else {
          if (acceleration.y > 0) {
            console.log('portrait');
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
          } else {
            console.log('portrait-reversed');
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
            cameraIcon.classList.add('rotate180');
          }
        }
      });
  }

  private getCurrentOrientation(): Promise<string> {
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
      image.src = imageData;

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
        resolve(canvas.toDataURL('JPG', 100));
      };
    });
  }


  private prepareToCrop(imageData) {
    this.getCurrentOrientation().then(orientation => {
      if (orientation == 'portrait') {
        console.log('portret');
        this.cropPicture(imageData, false);
      } else {
        let rotation;
        if (orientation == 'landscape') {
          console.log('landskejp');
          rotation = 270;
        } else if (orientation == 'portrait-reversed') {
          console.log('portrait reversed');
          rotation = 180;
        } else {
          rotation = 90;
        }
        this.rotateImage(imageData, rotation).then(rotatedImg => {
          this.cs.rotatedImg = (<any>window).Ionic.WebView.convertFileSrc(rotatedImg);
          this.cropPicture(rotatedImg, true);
        });
      }
    });
  }

  async takePicture() {
    const result = await this.cameraPreview.takePicture(this.cameraPictureOpts);
    await this.cameraPreview.stopCamera();
    this.picture = 'data:image/jpeg;base64,' + result;
    this.cs.originalPicture = this.picture;
    this.prepareToCrop(this.picture);
  }

  cropPicture(picture: string, rotated: boolean) {
    const rectangle = document.getElementById('aim-div');
    if (rotated) {
      const container = document.getElementById('container');

      container.classList.remove('container');
      rectangle.classList.remove('aim');

      container.classList.add('containerRotated');
      rectangle.classList.add('aimRotated');
    }
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

      const params = { data: cropped_img_base64, prefix: 'kolokwium_', format: 'JPG', quality: 100, mediaScanner: true };
      await this.diagnostic.requestExternalStorageAuthorization().then(() => {
        //User gave permission 
      }).catch(error => {
        //Handle error
      });

      (<any>window).imageSaver.saveBase64Image(params,
        (filePath) => {
          this.cs.capturedSnapURL = this.cs.capturedSnapURL = (<any>window).Ionic.WebView.convertFileSrc(filePath);
          this.cs.doOcr(filePath);
          this.cameraPreview.stopCamera();
          this.deviceMotionSubscribe.unsubscribe();
          console.log('File saved on ' + filePath);
          //save picture to firestore
          this.goBack();

        },
        (err) => {
          console.error(err);
        }
      );


      // usuwanie z galerii, podaj path
      // var params = {data: "/data/data/test.png"};
      // (<any>window)window.imageSaver.removeImageFromLibrary(params,
      //     function (filePath) {
      //       console.log('File removed from ' + filePath);
      //     },
      //     function (msg) {
      //       console.error(msg);
      //     }
      //   );
    };
  }

  goBack() {
    this.navCtrl.pop();
  }

  lockView() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ngOnInit() {
    this.startCamera();
    this.changeCameraToMatchCurrOrientation(this.viewChanged);
    this.lockView();
  }

}


