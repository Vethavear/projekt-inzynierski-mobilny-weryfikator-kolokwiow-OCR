import { Component, OnInit } from '@angular/core';
import { CameraRelatedService } from '../services/camera-related/camera-related.service';
import { StudentRelatedService } from '../services/student-related/student-related.service';
import { VerifyingRelatedService } from '../services/verifying-related/verifying-related.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(protected cs: CameraRelatedService, protected ss: StudentRelatedService, protected vrs: VerifyingRelatedService) { }

  ngOnInit() { }

}
