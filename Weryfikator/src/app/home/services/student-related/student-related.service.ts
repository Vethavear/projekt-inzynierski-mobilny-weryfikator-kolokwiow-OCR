import { Injectable } from '@angular/core';
import { Student } from './student';
import { Network } from '@ionic-native/network/ngx';
import { QueueComponent } from '../../queue/queue.component';
import { CameraRelatedService } from '../camera-related/camera-related.service';
import { CssSelector } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class StudentRelatedService {

  waitingStudents: Student[] = [];
  localStorageQueue: string;
  queueShown = false;
  studentShown = false;
  currentStudent: Student;
  missedChars = {
    expectedchars: [],
    positions: [],
  };

  constructor(public network: Network) {
    this.retrieveQueueFromLocalStorage();
  }

  initializeCurrentStudent(student: Student) {
    this.currentStudent = student;
    this.studentShown = true;
  }

  removeStudent() {
    this.studentShown = false;
  }

  checkInternetConnection() {
    const networkState = this.network.type;
    if (networkState !== this.network.Connection.NONE) {
      this.sendStudentGradeToDb();
      console.log('mamy neta');
    } else {
      this.addStudentToQueue();
      console.log('nie mamy neta');
    }
  }

  calculateAndMatchUnrecognisedChars() {
    this.currentStudent.answersArr.forEach((element, index) => {
      if (element === 'N') {
        this.missedChars.positions.push(index);
        this.missedChars.expectedchars.push(this.currentStudent.correctAnswersArr[index]);
      }
    });
  }

  addStudentToQueue() {
    this.studentShown = false;
    this.queueShown = true;
    this.waitingStudents.push(this.currentStudent);
    localStorage.setItem('queuedStudents', JSON.stringify(this.waitingStudents));
  }

  retrieveQueueFromLocalStorage() {

    const storage = JSON.parse(localStorage.getItem('queuedStudents'));
    // Restoring likes from the localStorage
    if (storage) {
      this.waitingStudents = storage;
    }
  }
  showQueue() {
    this.queueShown = !this.queueShown;

  }

  sendStudentGradeToDb() {
    //firestore code

    this.studentShown = false;
  }


}
