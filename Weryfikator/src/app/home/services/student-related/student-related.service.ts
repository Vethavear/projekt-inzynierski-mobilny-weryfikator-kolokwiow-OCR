import { Injectable } from '@angular/core';
import { Student } from './student';

import { QueueComponent } from '../../queue/queue.component';
import { CameraRelatedService } from '../camera-related/camera-related.service';
import { CssSelector } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class StudentRelatedService {

  waitingStudents: Student[] = [];
  queueShown = false;
  studentShown = false;
  currentStudent: Student;

  constructor() {
  }

  initializeCurrentStudent(student: Student) {
    this.currentStudent = student;
    this.studentShown = true;
  }

  removeStudent() {
    this.studentShown = false;
  }
  checkInternetConnection() {

    //check internet connection

  }

  addStudentToQueue(student: Student) {
    this.waitingStudents.push(student);
  }

  showQueue() {
    this.queueShown = !this.queueShown;

  }

  sendStudentGradeToDb(examId, student, grade) {
    //firestore code

    this.studentShown = false;
  }


}
