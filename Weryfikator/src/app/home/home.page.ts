import { Component } from '@angular/core';
import { CameraRelatedService } from './services/camera-related/camera-related.service';
import { VerifyingRelatedService } from './services/verifying-related/verifying-related.service';
import { StudentRelatedService } from './services/student-related/student-related.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {


  constructor(protected cs: CameraRelatedService, protected vs: VerifyingRelatedService, protected ss: StudentRelatedService) {

  }








  // async presentToastWithOptions() {
  //   const toast = await this.toastController.create({
  //     header: 'Imie i Nazwisko',
  //     message: 'Wynik',
  //     position: 'bottom',
  //     buttons: [
  //       {
  //         side: 'start',
  //         icon: 'checkbox-outline',
  //         text: 'Zapisz ocene',
  //         handler: () => {
  //           // dodać obsługę i do firestora cyk
  //           console.log('Zapisano ocene');
  //         }
  //       }, {
  //         text: 'Cofnij',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   toast.present();
  // }




}
