
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { CameraRelatedService } from '../services/camera-related/camera-related.service';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})

export class CameraComponent implements OnInit {
  picture: string;
  cameraOpts: CameraPreviewOptions;
  cameraPictureOpts: CameraPreviewPictureOptions;
  deviceMotionSubscribe;

  constructor(
    private navCtrl: NavController,
    protected cameraPreview: CameraPreview,
    protected screenOrientation: ScreenOrientation,
    protected cs: CameraRelatedService,
    protected router: Router,
    private deviceMotion: DeviceMotion,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private platform: Platform) {
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
    this.cameraPreview.setFlashMode(this.cs.flash);
    this.cameraPreview.onBackButton().then(clicked => {
      this.navCtrl.pop();
    });
  }



  private changeCameraToMatchCurrOrientation() {
    this.deviceMotionSubscribe = this.deviceMotion.watchAcceleration({ frequency: 200 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        const cameraIcon = document.getElementById('cameraIcon');
        if (Math.abs(acceleration.x) > Math.abs(acceleration.y)) {
          if (acceleration.x > 0) {
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
            cameraIcon.classList.add('rotate90');
          } else {
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
            cameraIcon.classList.add('rotate-90');
          }
        } else {
          if (acceleration.y > 0) {
            cameraIcon.classList.remove('rotate180');
            cameraIcon.classList.remove('rotate90');
            cameraIcon.classList.remove('rotate-90');
          } else {
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
      const rotatedImg = new Image();
      rotatedImg.src = imageData;
      rotatedImg.onload = () => {
        if ((degrees / 90) % 2 === 0) {
          canvas.width = rotatedImg.width;
          canvas.height = rotatedImg.height;
        } else {
          canvas.width = rotatedImg.height;
          canvas.height = rotatedImg.width;
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
        canvasContext.drawImage(rotatedImg, 0, 0);
        resolve(canvas.toDataURL('image/png', 1.0));
      };
    });
  }

  private prepareToCrop(imageData) {
    this.getCurrentOrientation().then(orientation => {
      if (orientation == 'portrait') {
        this.cropAndImprovePicture(imageData, false);
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
          this.cropAndImprovePicture(rotatedImg, true);
        });
      }
    });
  }

  async takePicture() {
    const result = await this.cameraPreview.takePicture(this.cameraPictureOpts);
    await this.cameraPreview.stopCamera();
    this.picture = 'data:image/jpeg;base64,' + result;
    this.prepareToCrop(this.picture);
  }

  cropAndImprovePicture(picture: string, rotated: boolean) {
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
    const croppedImg = new Image();

    // image will contain CROPPED image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    croppedImg.src = picture;
    croppedImg.onload = async () => {

      // Required to map rectangle(from screen) into original image
      const x_axis_scale = croppedImg.width / window.screen.width;
      const y_axis_scale = croppedImg.height / window.screen.height;

      // INTERPOLATE
      const x_coord_int = x * x_axis_scale;
      const y_coord_int = y * y_axis_scale;
      const rect_width_int = rect_width * x_axis_scale;
      const rect_height_int = rect_height * y_axis_scale;
      // Set canvas size equivalent to interpolated rectangle size
      canvas.width = rect_width_int;
      canvas.height = rect_height_int;

      ctx.drawImage(croppedImg,
        x_coord_int, y_coord_int,           // Start CROPPING from x_coord(interpolated) and y_coord(interpolated)
        rect_width_int, rect_height_int,    // Crop interpolated rectangle
        0, 0,                               // Place the result at 0, 0 in the canvas,
        rect_width_int, rect_height_int);   // Crop interpolated rectangle

      // CHANGING COLOURS AND CONTRAST!!!
      // pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // grayscale brightness=30 contrast=70 60% skutecznosc
      // grayscale brightness=40 contrast=70 30% skutecznosc
      // grayscale brightness=20 contrast=70 30% skutecznosc
      // grayscale brightness=30 contrast=60 40% skutecznosc

      // grayscale
      for (let i = 0; i < pixels.length; i += 4) {
        let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = avg; // red
        pixels[i + 1] = avg; // green
        pixels[i + 2] = avg; // blue
      }

      // brightness
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] += this.cs.brightness;
        pixels[i + 1] += this.cs.brightness;
        pixels[i + 2] += this.cs.brightness;
      }

      // contrast
      let factor = (259.0 * (this.cs.contrast + 255.0)) / (255.0 * (259.0 - this.cs.contrast));
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = (factor * (pixels[i] - 128.0) + 128.0);
        pixels[i + 1] = (factor * (pixels[i + 1] - 128.0) + 128.0);
        pixels[i + 2] = (factor * (pixels[i + 2] - 128.0) + 128.0);
      }



      // tresholding FOR FUTURE IMPROVEMENT
      // for (var i = 0; i < data.length; i += 4) {
      //   var r = data[i];
      //   var g = data[i + 1];
      //   var b = data[i + 2];
      //   var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
      //   data[i] = data[i + 1] = data[i + 2] = v;
      // }

      ctx.putImageData(imageData, 0, 0);
      ctx.scale(2, 2);
      // Get base64 representation of cropped image
      const cropped_img_base64 = canvas.toDataURL('image/png', 1.0);
      await this.diagnostic.requestRuntimePermissions([this.diagnostic.permission.READ_EXTERNAL_STORAGE, this.diagnostic.permission.WRITE_EXTERNAL_STORAGE]);
      const params = { data: cropped_img_base64, prefix: 'kolokwium_', format: 'JPG', quality: 100, mediaScanner: true };
      (window as any).imageSaver.saveBase64Image(params,
        (filePath) => {
          this.cs.doOcr(filePath).then(done => {
            //delete img
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
              result => {
                (window as any).resolveLocalFileSystemURL(filePath, function (dirEntry) {
                  function successHandler() {
                  }
                  function errorHandler() {
                  }
                  dirEntry.remove(successHandler, errorHandler);
                });
              }).catch(
                err => {
                  this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).catch(success => {
                    (window as any).resolveLocalFileSystemURL(filePath, function (dirEntry) {
                      function successHandler() {
                      }
                      function errorHandler() {
                      }
                      dirEntry.remove(successHandler, errorHandler);
                    });
                  });
                }
              );

          }).catch(err => {
            console.log('brak uprawnien')
          });
          this.cameraPreview.stopCamera();
          this.deviceMotionSubscribe.unsubscribe();
          this.goBack();
        },
        (err) => {
          console.error(err);
        }
      );
    };
  }

  goBack() {
    this.navCtrl.pop();
  }

  lockView() {
    if (this.platform.is('mobile')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

  }

  ngOnInit() {
    this.platform.ready().then(ready => {
      this.startCamera();
      this.changeCameraToMatchCurrOrientation();
      this.lockView();
    });

  }

}


