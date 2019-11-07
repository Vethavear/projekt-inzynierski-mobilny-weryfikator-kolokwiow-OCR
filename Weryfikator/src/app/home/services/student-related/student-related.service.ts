import { Injectable } from '@angular/core';
import { Student } from './student';
import { Network } from '@ionic-native/network/ngx';
import { QueueComponent } from '../../queue/queue.component';
import { CameraRelatedService } from '../camera-related/camera-related.service';
import { CssSelector } from '@angular/compiler';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
@Injectable({
  providedIn: 'root'
})
export class StudentRelatedService {

  waitingStudents: Student[] = [];
  localStorageQueue: string;
  queueShown = false;
  studentShown = false;
  correctedAnswer = [];
  currentStudent: Student;
  missedChars = {
    expectedchars: [],
    positions: [],
  };
  expandedButtons: boolean[] = [];

  constructor(public network: Network) {
    this.retrieveQueueFromLocalStorage();
  }

  initializeCurrentStudent(student: Student) {
    this.currentStudent = student;
    this.studentShown = true;
    this.calculateStudentPoints();
    this.calculateAndMatchUnrecognisedChars();
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
        this.expandedButtons.push(true);
        ;

      }
    });
    console.log(this.expandedButtons.toString());
  }

  recalculateStudentsGrade(character, position, index) {
    this.currentStudent.answersArr[position] = character.toString();
    this.calculateStudentPoints(); // DLACZEGO NIE AKTUALIZUJE? XD
    this.expandButtons(index);
  }

  expandButtons(index) {
    console.log('expandbuuttons' + index);
    console.log(this.expandedButtons[index]);
    this.expandedButtons[index] = !this.expandedButtons[index];
  }

  public calculateStudentPoints() {
    let studentPoints = 0;
    const maxPoints = this.currentStudent.correctAnswersArr.length;
    this.currentStudent.correctAnswersArr.forEach((correctAnswer, index) => {
      if (correctAnswer === this.currentStudent.answersArr[index]) {
        studentPoints++;
      }
    });
    this.currentStudent.points = studentPoints;
    const studentGainedPercentage = (studentPoints / maxPoints) * 100;

    if (studentGainedPercentage < 50) {
      this.currentStudent.grade = 2;
    } else if (studentGainedPercentage < 62.5) {
      this.currentStudent.grade = 3;
    } else if (studentGainedPercentage < 75) {
      this.currentStudent.grade = 3.5;
    } else if (studentGainedPercentage < 87.5) {
      this.currentStudent.grade = 4;
    } else if (studentGainedPercentage < 90) {
      this.currentStudent.grade = 4.5;
    } else {
      this.currentStudent.grade = 5;
    }

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
