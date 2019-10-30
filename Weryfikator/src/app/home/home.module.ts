import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NavbarComponent } from './navbar/navbar.component';
import { QueueComponent } from './queue/queue.component';
import { InstructionComponent } from './instruction/instruction.component';
import { CameraComponent } from './camera/camera.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'camera',
        component: CameraComponent
      }
    ])
  ],
  declarations: [HomePage, NavbarComponent, QueueComponent, InstructionComponent, CameraComponent],
})
export class HomePageModule { }
