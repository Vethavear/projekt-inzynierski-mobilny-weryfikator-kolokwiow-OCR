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
    // this.waitingStudents.push(new Student(100440, '80%'));
    // this.waitingStudents.push(new Student(100441, '75%'));
  }


  addStudentToQueue(student: Student) {
    this.waitingStudents.push(student);
  }

  showQueue() {
    this.queueShown = !this.queueShown;

  }

  sendStudentGradeToDb(examId, student, grade) {
    //firestore code
  }
}
