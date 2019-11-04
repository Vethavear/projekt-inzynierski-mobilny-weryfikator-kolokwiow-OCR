import { Injectable } from '@angular/core';
import { CameraRelatedService } from '../camera-related/camera-related.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyingRelatedService {

  constructor() {
  }


  public static prepareData(barcodeData: string, studentAnswers: string) {

    const data = barcodeData.split(',');

    // odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
    const correctAnswers = data[0];
    const studentIndexNumber = data[1];
    const studentGroup = data[2];
    const studentName = data[3];
    const studentSurname = data[4];
    const examName = data[5];
    const correctAnswersArr = correctAnswers.split('');

    const studentAnswersArr = studentAnswers.split('');


    // zamien litery ktore mogly zostac zle odczytane
    const correctedStudentAnswersArr = studentAnswersArr.map((element, index) => {

      if (element === '6' && index !== 10 && index !== 37 && index !== 57 && index !== 77) {
        return 'G';
      } else if (element === '8' && index !== 14 && index !== 43 && index !== 63 && index !== 83) {
        return 'B';
      } else if (element === 'p' || element === 'P') {
        return 'F';
      } else if (element === '&') {
        return 'G';
      } else if (element === 'L') {
        return 'B';
      } else if (element === '(') {
        return 'C';
      } else {
        return element;
      }
    });

    // correctAnswersArr.forEach((correctAnswer, index) => {
    //   if (correctAnswer === studentAnswersArr[index]) {
    //     studentPoints++;
    //   }
    // });
    // const studentGainedPercentage = `${(studentPoints / maxPoints) * 100}%`;
    // console.log(maxPoints);
    // console.log(studentPoints);
    // console.log((studentPoints / maxPoints) * 100 + '%');
    // console.log(studentGainedPercentage);
  }
}
