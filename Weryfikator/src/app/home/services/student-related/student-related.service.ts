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
  correctedAnswer = [];
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
      }
    });
  }

  recalculateStudentsGrade(character, position) {
    this.currentStudent.answersArr[position] = character;
    this.calculateStudentPoints(); // DLACZEGO NIE AKTUALIZUJE? XD
  }

  public calculateStudentPoints() {
    console.log('poprawne odp')
    console.log(this.currentStudent.correctAnswersArr.toString());
    console.log('odp studenta')
    console.log(this.currentStudent.answersArr.toString());
    let studentPoints = 0;
    const maxPoints = this.currentStudent.correctAnswersArr.length;
    this.currentStudent.correctAnswersArr.forEach((correctAnswer, index) => {
      console.log(correctAnswer + 'POPRAWNA');
      console.log(this.currentStudent.answersArr[index] + 'STUDENTA');
      if (correctAnswer === this.currentStudent.answersArr[index]) {
        studentPoints++;
        console.log(studentPoints);
      }
    });
    this.currentStudent.points = studentPoints;
    console.log(this.currentStudent.points);
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
