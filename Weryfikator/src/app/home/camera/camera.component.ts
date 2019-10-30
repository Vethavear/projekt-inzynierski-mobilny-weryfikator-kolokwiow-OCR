
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DOCUMENT } from '@angular/common';
import { readdir } from 'fs';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})

export class CameraComponent implements OnInit {
  picture: string;
  cameraOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    camera: 'rear',
    toBack: true
  };
  cameraPictureOpts: CameraPreviewPictureOptions = {
    width: window.innerWidth,
    height: window.innerHeight,
    quality: 100
  };


  constructor(
    public navCtrl: NavController,
    protected cameraPreview: CameraPreview, protected screenOrientation: ScreenOrientation) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  ngOnInit() {

  }


  async startCamera() {
    this.picture = null;
    const result = await this.cameraPreview.startCamera(this.cameraOpts);

    // console.log(result);
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  async takePicture() {
    const result = await this.cameraPreview.takePicture(this.cameraPictureOpts);
    await this.cameraPreview.stopCamera();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.picture = 'data:image/jpeg;base64,' + result;
    // this.cameraPreview.stopCamera();
    // document.getElementById('ioncontent').classList.remove('clearBg');
  }


}


