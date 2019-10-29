import { Component, OnInit } from '@angular/core';
import { CameraRelatedService } from '../home/services/camera-related/camera-related.service';
import { StudentRelatedService } from '../home/services/student-related/student-related.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(protected cs: CameraRelatedService, protected ss: StudentRelatedService) { }

  ngOnInit() { }

}
