import { Injectable } from '@angular/core';
import { Student } from '../student-related/student';
import { StudentRelatedService } from '../student-related/student-related.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class VerifyingRelatedService {
  correctAnswersArr: string[];
  studentAnswersArr: string[];
  student: Student;
  qrScanned: boolean = false;
  constructor(public ss: StudentRelatedService, public alertController: AlertController, public router: Router) {
  }


  public prepareBarcodeData(barcodeData: string) {
    this.qrScanned = true;
    const data = barcodeData.split(',');
    if (data.length < 6) {
      // not enough data, QR broken
      this.presentAlert('Za mało danych z kodu QR. Kod QR uszkodzony. Spróbuj ponownie lub wydrukuj sprawdzian jeszcze raz', true);
      this.qrScanned = false;
    } else if (data[0].match(/[^a-h]/ig)) {
      this.presentAlert('Kod QR uszkodzony. Wydrukuj sprawdzian jeszcze raz', true);
      this.qrScanned = false;
    } else {
      // odp[0], indeks[1], grupa[2], imie[3], nazwisko[4], kolokwium[5]
      const correctAnswers = data[0];
      const studentIndexNumber = data[1];
      const studentGroup = data[2];
      const studentName = data[3];
      const studentSurname = data[4];
      const examName = data[5];
      this.student = new Student(studentIndexNumber, studentGroup, studentName, studentSurname, examName);
      this.correctAnswersArr = correctAnswers.split('');
    }
  }

  public correctDataFromOCR(stringWithStudentAnswers) {
    this.qrScanned = false;
    const arrWithAnswers = stringWithStudentAnswers.split(',');
    let preparedStringWithStudentsAnswers = arrWithAnswers.join('');
    preparedStringWithStudentsAnswers = preparedStringWithStudentsAnswers.toUpperCase();
    let currentQuestion = 0;
    let numberEncountered = false;
    let arrWithStudentAnswers = [];
    console.log(arrWithStudentAnswers.toString());
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < preparedStringWithStudentsAnswers.length; i++) {
      // zmienne na potrzeby debugu
      let obecna = preparedStringWithStudentsAnswers[i];
      let obecnePytanie = currentQuestion + 1;
      let obecneI = preparedStringWithStudentsAnswers[i];
      let ip1 = preparedStringWithStudentsAnswers[i + 1];
      if (currentQuestion + 1 <= 9) {
        //przypadek krancowy jak zaczynamy i nic nie ma
        if (currentQuestion + 1 === 1 && preparedStringWithStudentsAnswers[i] === '1' && preparedStringWithStudentsAnswers[i + 1] === '2') {
          arrWithStudentAnswers.push('N');
          numberEncountered = true;
          continue;
        }
        if (preparedStringWithStudentsAnswers[i] === (currentQuestion + 1).toString() && !numberEncountered) {
          // jesli jestesmy na cyferce i wczesniej nie spotkalismy numeru to continue zdrowa sytuacja
          numberEncountered = true;
          continue;
        } else if (preparedStringWithStudentsAnswers[i].match(/[^0-9]/g) && numberEncountered) {
          // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej numer (zdrowa sytuacja np 1A)
          numberEncountered = false;
          arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
          currentQuestion++;
        } else if (preparedStringWithStudentsAnswers[i].match(/[0-9]/g) && numberEncountered) {
          // jesteśmy na cyfrze a wczesniej juz byla cyfra.
          if (preparedStringWithStudentsAnswers[i] === (currentQuestion + 2).toString()) {
            // obecna cyfra jest tą następną którą mamy badać. Wniosek: Brakuje odpowiedzi między nimi lub rozpoznano cyfre zamiast słowa

            // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
            if (currentQuestion + 1 === 3) {
              // jesli jestesmy na 3, sprawdz czy obecna jest 4 i czy nastepna jest 4
              if (preparedStringWithStudentsAnswers[i] === '4' && preparedStringWithStudentsAnswers[i + 1] === '4') {
                // prawidlowa odpowiedz dla 3 jest A
                arrWithStudentAnswers.push('A');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                // obecnie mamy 4 w [i] a 3 w curr question czyli wstaw n bo nie ma
                arrWithStudentAnswers.push('N');
                numberEncountered = true;
                currentQuestion++;
              }
            } else if (currentQuestion + 1 === 5) {
              // jesli jestesmy na 5, sprawdz czy obecna jest 6 i czy nastepna jest 6
              if (preparedStringWithStudentsAnswers[i] === '6' && preparedStringWithStudentsAnswers[i + 1] === '6') {
                // prawidlowa odpowiedz dla 5 jest G
                arrWithStudentAnswers.push('G');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                // obecnie mamy 6 w [i] a 5 w curr question czyli wstaw n bo nie ma
                arrWithStudentAnswers.push('N');
                numberEncountered = true;
                currentQuestion++;
              }
            } else if (currentQuestion + 1 === 7) {
              // jesli jestesmy na 7, sprawdz czy obecna jest 8 i czy nastepna jest 8
              if (preparedStringWithStudentsAnswers[i] === '8' && preparedStringWithStudentsAnswers[i + 1] === '8') {
                // prawidlowa odpowiedz dla 7 jest B
                arrWithStudentAnswers.push('B');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                // obecnie mamy 8 w [i] a 7 w curr question czyli wstaw n bo nie ma
                arrWithStudentAnswers.push('N');
                numberEncountered = true;
                currentQuestion++;
              }
            } else {
              // nie jest to zaden z powyzszych przypadkow wiec po prostu brakuje tu odpowiedzi, push N
              arrWithStudentAnswers.push('N');
              numberEncountered = true;
              currentQuestion++;
              continue;
            }
          } else {
            if (preparedStringWithStudentsAnswers[i] === '4') {
              arrWithStudentAnswers.push('A');
              numberEncountered = false;
              currentQuestion++;
            } else if (preparedStringWithStudentsAnswers[i] === '6') {
              arrWithStudentAnswers.push('G');
              numberEncountered = false;
              currentQuestion++;
            } else if (preparedStringWithStudentsAnswers[i] === '8') {
              arrWithStudentAnswers.push('B');
              numberEncountered = false;
              currentQuestion++;
            }
          }
          // CYFRY ODCZYTANE JAKO LITERY
        } else if (preparedStringWithStudentsAnswers[i].match(/[^0-9]/g) && !numberEncountered) {
          // jestesmy na literce a wczesniej byla juz literka
          // ABCDEFGHA
          // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
          if (currentQuestion + 1 === 4) {
            // jesli jestesmy na 4, sprawdz czy nastepna jest literka, jesli tak to mamy czworke jako A
            if (preparedStringWithStudentsAnswers[i] === 'A' && preparedStringWithStudentsAnswers[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą A, to jest 4 więc nie pushujemy
              // CO W SYTUACJI KIEDY ODCZYTALO SAME LITERKI?
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
              currentQuestion++;
            }
          } else if (currentQuestion + 1 === 5) {
            // jesli jestesmy na 5, sprawdz czy nastepna jest literka, jesli tak to mamy 5 jako S
            if (preparedStringWithStudentsAnswers[i] === 'S' && preparedStringWithStudentsAnswers[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą S, to jest 5 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
              currentQuestion++;
            }
          } else if (currentQuestion + 1 === 8) {
            // jesli jestesmy na 8, sprawdz czy nastepna jest literka, jesli tak to mamy 8 jako B
            if (preparedStringWithStudentsAnswers[i] === 'B' && preparedStringWithStudentsAnswers[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą B, to jest 8 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
              currentQuestion++;
            }

          } else if (currentQuestion + 1 === 9) {
            // jesli jestesmy na 9, sprawdz czy nastepna jest literka, jesli tak to mamy 9 jako °
            if (preparedStringWithStudentsAnswers[i] === '°' && preparedStringWithStudentsAnswers[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą B, to jest 8 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else if (preparedStringWithStudentsAnswers[i] === 'O' && preparedStringWithStudentsAnswers[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą B, to jest 8 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
              currentQuestion++;
            }

          } else {
            // Wczesniej byla literka, OCR nie odczytal blednie 4 albo 8 wiec po prostu nie odczytal cyfry, push
            numberEncountered = false;
            arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
            currentQuestion++;

          }
          // CYFRA A WCZESNIEJ BYLA JUZ CYFRA, OBECNIE BADANY ZNAK NIE JEST OBECNIE BADANYM PYTANIEM
        } else if (preparedStringWithStudentsAnswers[i].match(/[0-9]/g) && !numberEncountered) {
          // prawdopodobnie nie ma nic miedzy 9 a 10
          if (preparedStringWithStudentsAnswers[i] === '1' && (currentQuestion + 1) === 9) {
            i--;
            //cofnij sie na 1 ponownie, zebys wszedl na dwucyfrowe jako 1 a nie 0
            arrWithStudentAnswers.push('N');
            numberEncountered = false;
            currentQuestion++;
          }
        }
      } else {
        // DLA DWUCYFRFOWYCH

        // przypadek krancowy, nie odczytano wartosci dla ostatniego pola w arrayu
        if (i === preparedStringWithStudentsAnswers.length - 1 && preparedStringWithStudentsAnswers[i].match(/[0-9]/g)) {
          arrWithStudentAnswers.push('N');
          break;
        }

        if ((preparedStringWithStudentsAnswers[i] + preparedStringWithStudentsAnswers[i + 1]) === (currentQuestion + 1).toString() && !numberEncountered) {
          // jesli jestesmy na dwucyfrowej liczbie i wczesniej nie spotkalismy numeru to continue oraz i++ zeby trafic na potencjalna literke
          numberEncountered = true;
          i++;
          continue;
        } else if (preparedStringWithStudentsAnswers[i].match(/[^0-9]/g) && numberEncountered) {
          // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej numer (zdrowa sytuacja np 10A)

          if (preparedStringWithStudentsAnswers[i] === 'O') {
            numberEncountered = true;
          } else {
            numberEncountered = false;
            arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
            currentQuestion++;
          }
        } else if (preparedStringWithStudentsAnswers[i].match(/[^0-9]/g) && !numberEncountered) {
          // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej litere np 10C1B12D
          if (preparedStringWithStudentsAnswers[i] === 'S') {
            numberEncountered = true;
          } else if (preparedStringWithStudentsAnswers[i] === 'O') {
            numberEncountered = true;

          } else if (preparedStringWithStudentsAnswers[i + 1] + preparedStringWithStudentsAnswers[i + 2] == (currentQuestion + 1).toString()) {
            // omijamy, jest dziwna sytuacja typu 20AA21B itp
            numberEncountered = false;
            continue;
          }
          else {
            numberEncountered = false;
            arrWithStudentAnswers.push(preparedStringWithStudentsAnswers[i]);
            currentQuestion++;
          }
        } else if (preparedStringWithStudentsAnswers[i].match(/[0-9]/g) && numberEncountered) {
          // jesteśmy na cyfrze a wczesniej juz byla dwucyfrowa liczba.
          if ((preparedStringWithStudentsAnswers[i] + preparedStringWithStudentsAnswers[i + 1]) === (currentQuestion + 2).toString()) {
            // obecna cyfra jest tą następną którą mamy badać. Wniosek: Brakuje odpowiedzi między nimi lub rozpoznano cyfre zamiast słowa

            // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
            if (currentQuestion + 1 === 39) {
              // jesli jestesmy na 39, sprawdz czy obecna jest 4 i czy nastepna jest 4 (4 jako x[0] z 40)
              if (preparedStringWithStudentsAnswers[i] === '4' && preparedStringWithStudentsAnswers[i + 1] === '4') {
                // prawidlowa odpowiedz dla 39 jest A
                arrWithStudentAnswers.push('A');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                arrWithStudentAnswers.push('N');
                // cofnij sie o 1 bo teraz tak jakby jestes [i] na nastepnym elemencie!
                i--;
                numberEncountered = false;
                currentQuestion++;
                continue;
              }
            } else {
              // nie jest to 4 zamiast A na 39 pozycji więc po prostu brakuje tu odpowiedzi, push N
              arrWithStudentAnswers.push('N');
              // cofnij sie o 1 bo teraz tak jakby jestes [i] na nastepnym elemencie!
              i--;
              numberEncountered = false;
              currentQuestion++;
              continue;
            }
          } else {
            if (preparedStringWithStudentsAnswers[i] === '4') {
              arrWithStudentAnswers.push('A');
              numberEncountered = false;
              currentQuestion++;
            } else if (preparedStringWithStudentsAnswers[i] === '6') {
              arrWithStudentAnswers.push('G');
              numberEncountered = false;
              currentQuestion++;
            } else if (preparedStringWithStudentsAnswers[i] === '8') {
              arrWithStudentAnswers.push('B');
              numberEncountered = false;
              currentQuestion++;
            }
          }
        }
      }
    }

    arrWithStudentAnswers.forEach((element, index) => {
      if (element.match(/[^a-h]/)) {
        if (element === '(') {
          arrWithStudentAnswers[index] = 'C';
        } else if (element === '&') {
          arrWithStudentAnswers[index] = 'G';
        } else if (element === 'P') {
          arrWithStudentAnswers[index] = 'F';
        } else if (element === 'L') {
          arrWithStudentAnswers[index] = 'B';
        } else if (element === ')') {
          arrWithStudentAnswers[index] = 'D';
        }
      }
    });
    console.log(preparedStringWithStudentsAnswers);
    console.log(arrWithStudentAnswers.toString());
    if (arrWithStudentAnswers.length === this.correctAnswersArr.length) {
      console.log('nie brakuje zadnej odpowiedzi');
      console.log(arrWithStudentAnswers.toString());
      this.studentAnswersArr = arrWithStudentAnswers;
      this.student.answersArr = this.studentAnswersArr;
      this.student.correctAnswersArr = this.correctAnswersArr;
      this.ss.initializeCurrentStudent(this.student);
      this.qrScanned = false;
    } else {
      console.log(this.correctAnswersArr.length);
      console.log(arrWithStudentAnswers.length);
      this.presentAlert(`Spróbuj jeszcze raz, OCR zwrócił zbyt rozbieżny od pożądanego wynik. Brakuje ${this.correctAnswersArr.length - arrWithStudentAnswers.length} odpowiedzi`, false);
      console.log(`brakuje ${this.correctAnswersArr.length - arrWithStudentAnswers.length} odpowiedzi`);
    }
  }
  async presentAlert(string, qr) {
    let alert;
    if (qr) {
      alert = await this.alertController.create({
        header: 'Błąd QR',
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
    } else {
      alert = await this.alertController.create({
        header: 'Błąd OCR',
        message: string,
        buttons: [
          {
            text: 'Anuluj',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Zrób zdjęcie',
            handler: () => {
              this.router.navigateByUrl('/home/camera');
            }
          }
        ]
      });
    }
    await alert.present();
  }
}

