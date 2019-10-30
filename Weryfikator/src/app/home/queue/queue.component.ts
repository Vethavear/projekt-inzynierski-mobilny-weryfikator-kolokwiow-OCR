import { Component, OnInit } from '@angular/core';
import { StudentRelatedService } from '../services/student-related/student-related.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {

  constructor(protected ss: StudentRelatedService) { }

  ngOnInit() { }

}
