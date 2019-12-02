import { Injectable } from '@angular/core';
import { Student } from './student';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

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
    correctedAnswers: []
  };
  studentsCollection: AngularFirestoreCollection<any>;
  expandedButtons: boolean[] = [];

  constructor(private storage: AngularFireStorage,
    public network: Network,
    private firestore: AngularFirestore,
    private datePipe: DatePipe,
    public alertController: AlertController) {
    this.retrieveQueueFromLocalStorage();
    this.studentsCollection = this.firestore.collection('Students');

  }

  initializeCurrentStudent(student: Student) {
    this.currentStudent = student;
    this.studentShown = true;
    this.calculateStudentPoints();
    this.calculateAndMatchUnrecognisedChars();
  }

  removeStudent() {
    this.studentShown = false;
    this.expandedButtons = [];
    this.missedChars = {
      expectedchars: [],
      positions: [],
      correctedAnswers: []
    };
  }

  checkInternetConnection() {
    const networkState = this.network.type;
    if (networkState !== this.network.Connection.NONE) {
      return true;
    } else {
      return false;
    }
  }

  calculateAndMatchUnrecognisedChars() {
    this.currentStudent.answersArr.forEach((element, index) => {
      if (element === 'N') {
        this.missedChars.positions.push(index);
        this.missedChars.expectedchars.push(this.currentStudent.correctAnswersArr[index]);
        this.expandedButtons.push(true);
      }
    });
  }

  recalculateStudentsGrade(character, position, index) {
    this.currentStudent.answersArr[position] = character.toString();
    this.calculateStudentPoints();
    this.expandButtons(index);
  }

  expandButtons(index) {
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

  addStudentToQueue(student: Student) {
    this.studentShown = false;
    this.queueShown = true;
    this.waitingStudents.push(student);
    this.refreshLocalStorage();
  }

  refreshLocalStorage() {
    localStorage.setItem('queuedStudents', JSON.stringify(this.waitingStudents));
  }

  retrieveQueueFromLocalStorage() {
    const storage = JSON.parse(localStorage.getItem('queuedStudents'));
    if (storage) {
      this.waitingStudents = storage;
    }
  }

  showQueue() {
    this.queueShown = !this.queueShown;
  }

  getCurrentDate() {
    let dateString: string;
    const myDate = new Date();
    dateString = this.datePipe.transform(myDate, 'yyyy-MM-dd');
    return dateString;
  }

  sendStudentGradeToDb(isQueued: boolean, student: Student) {
    student.examDate = this.getCurrentDate();
    if (this.checkInternetConnection()) {
      this.studentsCollection
        .doc(student.group)
        .collection('students')
        .doc(student.indexNumber)
        .collection('grades')
        .add({
          date: student.examDate,
          grade: student.grade,
          name: student.examName,
          points: student.points,
          correctAnswers: student.correctAnswersArr,
          studentAnswers: student.answersArr
        })
        .then(success => {
          if (!isQueued) { this.studentShown = false; }
          if (isQueued) {
            // remove student from queue,
            this.waitingStudents.splice(this.waitingStudents.findIndex(value => value === student), 1);
            this.refreshLocalStorage();
          }
        }).catch(err => {
          this.presentAlertNoInternet('Bląd bazy danych, student wysłany do kolejki');
          this.addStudentToQueue(student);
        });
    } else if (isQueued) {
      // do nothing, bro remains in queue cause there is no internet
      this.presentAlertNoInternet('Brak internetu, student pozostanie w kolejce');
    } else {
      this.addStudentToQueue(student);
      this.presentAlertNoInternet('Brak internetu, student wyslany do kolejki.');

    }
    this.expandedButtons = [];
    this.missedChars = {
      expectedchars: [],
      positions: [],
      correctedAnswers: []
    };
  }

  async presentAlertNoInternet(string) {
    const alert = await this.alertController.create({
      header: 'Błąd',
      message: string,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
      ]
    });

    await alert.present();
  }

}
