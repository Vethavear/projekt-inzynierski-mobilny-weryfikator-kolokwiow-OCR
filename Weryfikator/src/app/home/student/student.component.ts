import { Component, OnInit } from '@angular/core';
import { StudentRelatedService } from '../services/student-related/student-related.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  constructor(protected ss: StudentRelatedService) { }
  ngOnInit() { }

}
