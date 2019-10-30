import { Injectable } from '@angular/core';
import { Student } from './student';

import { QueueComponent } from '../../queue/queue.component';
@Injectable({
  providedIn: 'root'
})
export class StudentRelatedService {

  waitingStudents: Student[] = [];
  queueShown = false;

  constructor() {
    this.waitingStudents.push(new Student(100440, '80%'));
    this.waitingStudents.push(new Student(100441, '75%'));
  }


  addStudentToQueue(indexNumber: number, grade: string) {
    this.waitingStudents.push(new Student(indexNumber, grade));
  }

  showQueue() {
    this.queueShown = !this.queueShown;

  }

  sendStudentGradeToDb(examId, indexNumber, grade) {
    //firestore code
  }
}
