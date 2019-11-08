import { Component, OnInit } from '@angular/core';
import { CameraRelatedService } from '../services/camera-related/camera-related.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsDisplayed = false;
  brightness;
  contrast;
  flash;
  constructor(public cs: CameraRelatedService) {
    this.fetchLocalStorageData();
  }

  ngOnInit() {

  }

  displaySettings() {
    this.settingsDisplayed = !this.settingsDisplayed;
  }

  applySettings() {
    let settings = [];
    settings.push(this.flash, this.brightness, this.contrast);
    localStorage.setItem('settings', JSON.stringify(settings));
    this.displaySettings();
  }

  fetchLocalStorageData() {
    const storage = JSON.parse(localStorage.getItem('settings'));
    // Restoring likes from the localStorage
    if (storage) {
      this.brightness = storage[1];
      this.contrast = storage[2];
      this.flash = storage[0];
      if (this.flash === true) {
        this.cs.flash = 'on';
      } else {
        this.cs.flash = 'off';
      }
      this.cs.contrast = this.contrast;
      this.cs.brightness = this.brightness;
    }
  }

}
