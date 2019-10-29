import { Injectable } from '@angular/core';
import { CameraRelatedService } from '../camera-related/camera-related.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyingRelatedService {

  constructor() {
  }


  public static verifyAnswers(correctAnswers: string, studentAnswers: string) {
    correctAnswers = 'ABCDABCDAB';
    studentAnswers = 'ABCDABCDCA';

    const maxPoints = correctAnswers.length;
    let studentPoints = 0;

    const correctAnswersArr = correctAnswers.split('');
    const studentAnswersArr = studentAnswers.split('');

    correctAnswersArr.forEach((correctAnswer, index) => {
      if (correctAnswer === studentAnswersArr[index]) {
        studentPoints++;
      }
    });
    const studentGainedPercentage = `${(studentPoints / maxPoints) * 100}%`;
    console.log(maxPoints);
    console.log(studentPoints);
    console.log((studentPoints / maxPoints) * 100 + '%');
    console.log(studentGainedPercentage);
  }
}
