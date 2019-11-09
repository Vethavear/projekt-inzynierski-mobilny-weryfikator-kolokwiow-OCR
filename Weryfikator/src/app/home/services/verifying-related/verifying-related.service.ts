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
    }
    else {
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

  public manipulateArr(odpstr) {
    this.qrScanned = false;
    // const odpstr = '1H,2H,3,A,B5,(6,(7,(BD,D,10E,11,F,12,F,13,G,14,6,15,6,16,A,17,A,18,A,19,B,20B,21,D,22,A,23,B,24,D,25,E,26,F,27,F,28,G,29,6,30,F,31,A,32,D,33,D,34,D,35,E,36,A,37,B,38,B,39,D,40,A';
    // const odpstr = '1H2H3AB5(6(7(BDD';
    const odpArr = odpstr.split(',');
    let odpArrNoCommas = odpArr.join('');
    odpArrNoCommas = odpArrNoCommas.toUpperCase();
    // const odpArrNoCommas = odpstr;
    const arrWithAnswers = [];
    let currentQuestion = 0;
    let numberEncountered = false;
    // °
    // dla pojedynczych cyfer:
    console.log(odpArr.toString());
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < odpArrNoCommas.length; i++) {
      let obecna = odpArrNoCommas[i];
      let obecnePytanie = currentQuestion + 1;
      let obecneI = odpArrNoCommas[i];
      let ip1 = odpArrNoCommas[i + 1];
      if (currentQuestion + 1 <= 9) {
        //przypadek krancowy jak zaczynamy i nic nie ma
        if (currentQuestion + 1 === 1 && odpArrNoCommas[i] === '1' && odpArrNoCommas[i + 1] === '2') {
          arrWithAnswers.push('N');
          numberEncountered = true;
          continue;
        }

        if (odpArrNoCommas[i] === (currentQuestion + 1).toString() && !numberEncountered) {
          // jesli jestesmy na cyferce i wczesniej nie spotkalismy numeru to continue
          numberEncountered = true;
          continue;
        } else if (odpArrNoCommas[i].match(/[^0-9]/g) && numberEncountered) {
          // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej numer (zdrowa sytuacja np 1A)
          numberEncountered = false;
          arrWithAnswers.push(odpArrNoCommas[i]);
          if (currentQuestion + 1 === 9) {

          }
          currentQuestion++;
        } else if (odpArrNoCommas[i].match(/[0-9]/g) && numberEncountered) {
          // jesteśmy na cyfrze a wczesniej juz byla cyfra.


          if (odpArrNoCommas[i] === (currentQuestion + 2).toString()) {
            // obecna cyfra jest tą następną którą mamy badać. Wniosek: Brakuje odpowiedzi między nimi lub rozpoznano cyfre zamiast słowa

            // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
            if (currentQuestion + 1 === 3) {
              // jesli jestesmy na 3, sprawdz czy obecna jest 4 i czy nastepna jest 4
              if (odpArrNoCommas[i] === '4' && odpArrNoCommas[i + 1] === '4') {
                // prawidlowa odpowiedz dla 3 jest A
                arrWithAnswers.push('A');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                // obecnie mamy 4 w [i] a 3 w curr question czyli wstaw n bo nie ma
                arrWithAnswers.push('N');
                numberEncountered = true;
                currentQuestion++;
              }
            } else if (currentQuestion + 1 === 5) {
              // jesli jestesmy na 5, sprawdz czy obecna jest 6 i czy nastepna jest 6
              if (odpArrNoCommas[i] === '6' && odpArrNoCommas[i + 1] === '6') {
                // prawidlowa odpowiedz dla 5 jest G
                arrWithAnswers.push('G');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                // obecnie mamy 6 w [i] a 5 w curr question czyli wstaw n bo nie ma
                arrWithAnswers.push('N');
                numberEncountered = true;
                currentQuestion++;
              }
            } else if (currentQuestion + 1 === 7) {
              // jesli jestesmy na 7, sprawdz czy obecna jest 8 i czy nastepna jest 8
              if (odpArrNoCommas[i] === '8' && odpArrNoCommas[i + 1] === '8') {
                // prawidlowa odpowiedz dla 7 jest B
                arrWithAnswers.push('B');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                // obecnie mamy 8 w [i] a 7 w curr question czyli wstaw n bo nie ma
                arrWithAnswers.push('N');
                numberEncountered = true;
                currentQuestion++;
              }
            } else {
              // nie jest to zaden z powyzszych przypadkow wiec po prostu brakuje tu odpowiedzi, push N
              arrWithAnswers.push('N');
              numberEncountered = true;
              currentQuestion++;
              continue;
            }
          } else {
            if (odpArrNoCommas[i] === '4') {
              arrWithAnswers.push('A');
              numberEncountered = false;
              currentQuestion++;
            } else if (odpArrNoCommas[i] === '6') {
              arrWithAnswers.push('G');
              numberEncountered = false;
              currentQuestion++;
            } else if (odpArrNoCommas[i] === '8') {
              arrWithAnswers.push('B');
              numberEncountered = false;
              currentQuestion++;
            }
          }
          // CYFRY ODCZYTANE JAKO LITERY
        } else if (odpArrNoCommas[i].match(/[^0-9]/g) && !numberEncountered) {
          // jestesmy na literce a wczesniej byla juz literka
          // ABCDEFGHA
          // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
          if (currentQuestion + 1 === 4) {
            // jesli jestesmy na 4, sprawdz czy nastepna jest literka, jesli tak to mamy czworke jako A
            if (odpArrNoCommas[i] === 'A' && odpArrNoCommas[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą A, to jest 4 więc nie pushujemy
              // CO W SYTUACJI KIEDY ODCZYTALO SAME LITERKI?
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithAnswers.push(odpArrNoCommas[i]);
              currentQuestion++;
            }
          } else if (currentQuestion + 1 === 5) {
            // jesli jestesmy na 5, sprawdz czy nastepna jest literka, jesli tak to mamy 5 jako S
            if (odpArrNoCommas[i] === 'S' && odpArrNoCommas[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą S, to jest 5 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithAnswers.push(odpArrNoCommas[i]);
              currentQuestion++;
            }
          } else if (currentQuestion + 1 === 8) {
            // jesli jestesmy na 8, sprawdz czy nastepna jest literka, jesli tak to mamy 8 jako B
            if (odpArrNoCommas[i] === 'B' && odpArrNoCommas[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą B, to jest 8 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithAnswers.push(odpArrNoCommas[i]);
              currentQuestion++;
            }

          } else if (currentQuestion + 1 === 9) {
            // jesli jestesmy na 9, sprawdz czy nastepna jest literka, jesli tak to mamy 9 jako °
            if (odpArrNoCommas[i] === '°' && odpArrNoCommas[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą B, to jest 8 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else if (odpArrNoCommas[i] === 'O' && odpArrNoCommas[i + 1].match(/[^0-9]/g)) {
              // skipujemy tą B, to jest 8 więc nie pushujemy
              numberEncountered = true;
              continue;
            } else {
              numberEncountered = false;
              arrWithAnswers.push(odpArrNoCommas[i]);
              currentQuestion++;
            }

          } else {
            // Wczesniej byla literka, OCR nie odczytal blednie 4 albo 8 wiec po prostu nie odczytal cyfry, push
            numberEncountered = false;
            arrWithAnswers.push(odpArrNoCommas[i]);
            currentQuestion++;

          }

        }

      } else {
        // DLA DWUCYFRFOWYCH


        if (i === odpArrNoCommas.length - 1 && odpArrNoCommas[i].match(/[0-9]/g)) {
          arrWithAnswers.push('N');
          break;
        }

        if ((odpArrNoCommas[i] + odpArrNoCommas[i + 1]) === (currentQuestion + 1).toString() && !numberEncountered) {
          // jesli jestesmy na dwucyfrowej liczbie i wczesniej nie spotkalismy numeru to continue oraz i++ zeby trafic na potencjalna literke
          numberEncountered = true;
          i++;
          continue;
        } else if (odpArrNoCommas[i].match(/[^0-9]/g) && numberEncountered) {
          // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej numer (zdrowa sytuacja np 10A)

          if (odpArrNoCommas[i] === 'O') {
            numberEncountered = true;
          } else {
            numberEncountered = false;
            arrWithAnswers.push(odpArrNoCommas[i]);
            currentQuestion++;
          }
        } else if (odpArrNoCommas[i].match(/[^0-9]/g) && !numberEncountered) {
          // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej litere np 10C1B12D
          if (odpArrNoCommas[i] === 'S') {
            numberEncountered = true;
          } else if (odpArrNoCommas[i] === 'O') {
            numberEncountered = true;
          } else {
            numberEncountered = false;
            arrWithAnswers.push(odpArrNoCommas[i]);
            currentQuestion++;
          }
        } else if (odpArrNoCommas[i].match(/[0-9]/g) && numberEncountered) {
          // jesteśmy na cyfrze a wczesniej juz byla dwucyfrowa liczba.
          if ((odpArrNoCommas[i] + odpArrNoCommas[i + 1]) === (currentQuestion + 2).toString()) {
            // obecna cyfra jest tą następną którą mamy badać. Wniosek: Brakuje odpowiedzi między nimi lub rozpoznano cyfre zamiast słowa

            // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
            if (currentQuestion + 1 === 39) {
              // jesli jestesmy na 39, sprawdz czy obecna jest 4 i czy nastepna jest 4 (4 jako x[0] z 40)
              if (odpArrNoCommas[i] === '4' && odpArrNoCommas[i + 1] === '4') {
                // prawidlowa odpowiedz dla 39 jest A
                arrWithAnswers.push('A');
                numberEncountered = false;
                currentQuestion++;
                continue;
              } else {
                arrWithAnswers.push('N');
                // cofnij sie o 1 bo teraz tak jakby jestes [i] na nastepnym elemencie!
                i--;
                currentQuestion++;
                continue;
              }
            } else {
              // nie jest to 4 zamiast A na 39 pozycji więc po prostu brakuje tu odpowiedzi, push N
              arrWithAnswers.push('N');
              // cofnij sie o 1 bo teraz tak jakby jestes [i] na nastepnym elemencie!
              i--;
              numberEncountered = false;
              currentQuestion++;
              continue;
            }
          } else {
            if (odpArrNoCommas[i] === '4') {
              arrWithAnswers.push('A');
              numberEncountered = false;
              currentQuestion++;
            } else if (odpArrNoCommas[i] === '6') {
              arrWithAnswers.push('G');
              numberEncountered = false;
              currentQuestion++;
            } else if (odpArrNoCommas[i] === '8') {
              arrWithAnswers.push('B');
              numberEncountered = false;
              currentQuestion++;
            }
          }
        }
      }
    }

    arrWithAnswers.forEach((element, index) => {
      if (element.match(/[^a-h]/)) {
        if (element === '(') {
          arrWithAnswers[index] = 'C';
        } else if (element === '&') {
          arrWithAnswers[index] = 'G';
        } else if (element === 'P') {
          arrWithAnswers[index] = 'F';
        } else if (element === 'L') {
          arrWithAnswers[index] = 'B';
        } else if (element === ')') {
          arrWithAnswers[index] = 'D';
        }
      }
    });
    console.log(arrWithAnswers.toString());
    if (arrWithAnswers.length === this.correctAnswersArr.length) {
      console.log('nie brakuje zadnej odpowiedzi');
      console.log(arrWithAnswers.toString());
      this.studentAnswersArr = arrWithAnswers;
      this.student.answersArr = this.studentAnswersArr;
      this.student.correctAnswersArr = this.correctAnswersArr;
      this.ss.initializeCurrentStudent(this.student);
      this.qrScanned = false;
    } else {
      this.presentAlert('<strong>Spróbuj jeszcze raz, OCR zwrócił zbyt rozbieżny od pożądanego wynik. Brakuje ${this.correctAnswersArr.length - arrWithAnswers.length} odpowiedzi</strong>', false);
      console.log(`brakuje ${this.correctAnswersArr.length - arrWithAnswers.length} odpowiedzi`);
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

