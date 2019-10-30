import { Component, OnInit } from '@angular/core';
import { CameraRelatedService } from '../services/camera-related/camera-related.service';
import { StudentRelatedService } from '../services/student-related/student-related.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(protected cs: CameraRelatedService, protected ss: StudentRelatedService) { }

  ngOnInit() { }

}
