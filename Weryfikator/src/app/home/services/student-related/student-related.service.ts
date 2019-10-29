import { Injectable } from '@angular/core';
import { Student } from './student';

import { QueueComponent } from '../../queue/queue.component';
@Injectable({
  providedIn: 'root'
})
export class StudentRelatedService {

  waitingStudents: Student[];


  constructor() { }


  addStudentToQueue(indexNumber: number, grade: string) {
    this.waitingStudents.push(new Student(indexNumber, grade));
  }

  async showQueue() {


  }

  sendStudentGradeToDb(examId, indexNumber, grade) {
    //firestore code
  }
}
