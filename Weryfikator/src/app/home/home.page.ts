import { Component } from '@angular/core';
import { CameraRelatedService } from './services/camera-related/camera-related.service';
import { VerifyingRelatedService } from './services/verifying-related/verifying-related.service';
import { StudentRelatedService } from './services/student-related/student-related.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(protected cs: CameraRelatedService, protected vs: VerifyingRelatedService, protected ss: StudentRelatedService) {
    // this.odp =
    //   '1H,2H,3,A,B5,(6,(7,(BD,D,10E,11,F,12,F,13,G,14,6,15,6,16,A,17,A,18,A,19,B,20B,21,D,22,A,23,B,24,D,25,E,26,F,27,F,28,G,29,6,30,F,31,A,32,D,33,D,34,D,35,E,36,A,37,B,38,B,39,D,40,A';
    // this.odpArr = this.odp.split(',');
    this.manipulateArr();

  }

  // algorytm to obliczenia ile powinien mieć string z odpowiedziami z OCR'a
  calculateOcrResultLength(answersLength) {
    if (answersLength <= 9) {
      return (answersLength * 2);
    } else {
      return ((answersLength - 9) * 2 + 9);
      // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
    }
  }


  manipulateArr() {
    const qrCorrectAnswers = 9;
    const ocrResultLength: number = this.calculateOcrResultLength(40);
    // const odpstr = '1H,2H,3,A,B5,(6,(7,(BD,D,10E,11,F,12,F,13,G,14,6,15,6,16,A,17,A,18,A,19,B,20B,21,D,22,A,23,B,24,D,25,E,26,F,27,F,28,G,29,6,30,F,31,A,32,D,33,D,34,D,35,E,36,A,37,B,38,B,39,D,40,A';
    // do ogarniecia jak same litery poda!
    const odpstr = 'ABC48D9G';
    // const odpArr = odpstr.split(',');
    // const odpArrNoCommas = odpArr.join('');
    const odpArrNoCommas = odpstr;
    const arrWithAnswers = [];
    if (odpstr.length === ocrResultLength) {
      console.log('nie brakuje zadnej odpowiedzi');
    } else {
      console.log(`brakuje ${ocrResultLength - odpstr.length} odpowiedzi`);
      let currentQuestion = 0;
      let numberEncountered = false;



      // dla pojedynczych cyfer:

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < odpArrNoCommas.length; i++) {
        if (currentQuestion <= 9) {
          if (odpArrNoCommas[i] === (currentQuestion + 1).toString() && !numberEncountered) {
            // jesli jestesmy na cyferce i wczesniej nie spotkalismy numeru to continue
            numberEncountered = true;
            continue;
          } else if (odpArrNoCommas[i].match(/[^1-9]/g) && numberEncountered) {
            // jesli jestesmy na znaku - potencjalnej odpowiedzi i napotkalismy wczesniej numer (zdrowa sytuacja np 1A)
            numberEncountered = false;
            arrWithAnswers.push(odpArrNoCommas[i]);
            currentQuestion++;
          } else if (odpArrNoCommas[i].match(/[1-9]/g) && numberEncountered) {
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
                }
              } else if (currentQuestion + 1 === 5) {
                // jesli jestesmy na 5, sprawdz czy obecna jest 6 i czy nastepna jest 6
                if (odpArrNoCommas[i] === '6' && odpArrNoCommas[i + 1] === '6') {
                  // prawidlowa odpowiedz dla 5 jest G
                  arrWithAnswers.push('G');
                  numberEncountered = false;
                  currentQuestion++;
                  continue;
                }
              } else if (currentQuestion + 1 === 7) {
                // jesli jestesmy na 7, sprawdz czy obecna jest 8 i czy nastepna jest 8
                if (odpArrNoCommas[i] === '8' && odpArrNoCommas[i + 1] === '8') {
                  // prawidlowa odpowiedz dla 7 jest B
                  arrWithAnswers.push('B');
                  numberEncountered = false;
                  currentQuestion++;
                  continue;
                }
              } else {
                // nie jest to zaden z powyzszych przypadkow wiec po prostu brakuje tu odpowiedzi, push N
                arrWithAnswers.push('N');
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
            // CYFRY ODCZYTANE JAKO LITERY
          } else if (odpArrNoCommas[i].match(/[^1-9]/g) && !numberEncountered) {
            // jestesmy na literce a wczesniej byla juz literka
            console.log('jestesmy na literce a wczesniej byla literka!');
            // ABCDEFGHA
            // jesli cyfry ktore mogly zostac omylnie rozpoznane są w poblizu:
            if (currentQuestion + 1 === 4) {
              // jesli jestesmy na 4, sprawdz czy nastepna jest literka, jesli tak to mamy czworke jako A
              if (odpArrNoCommas[i] === 'A' && odpArrNoCommas[i + 1].match(/[^1-9]/g)) {
                // skipujemy tą A, to jest 4 więc nie pushujemy
                // CO W SYTUACJI KIEDY ODCZYTALO SAME LITERKI?
                numberEncountered = true;
                continue;
              } else {
                numberEncountered = false;
                arrWithAnswers.push(odpArrNoCommas[i]);
                currentQuestion++;
              }
            } else if (currentQuestion + 1 === 8) {
              // jesli jestesmy na 8, sprawdz czy nastepna jest literka, jesli tak to mamy 8 jako B
              if (odpArrNoCommas[i] === 'B' && odpArrNoCommas[i + 1].match(/[^1-9]/g)) {
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
          // dla dwucyfrowych odpowiedzi:

        }
      }
      console.log(arrWithAnswers.toString());

      // const odpArr = ['1H', '2H', '3', 'A', 'B5', '(6', '(7', '(BD'];
      // const odpArr = odpstr.split(',');
      // console.log(odpArr.toString());
      // console.log('---');
      // let newArr: string[] = [];
      // let answersToCompare: string[] = [];
      // let newArrSize: number;

      // // zamien znaki ktore nie stwarzaja zagrozenia pomylenia z liczba, np ( z C itp
      // console.log('elementy dziwne do zmiany: ');
      // let weirdElements = [];
      // odpArr.forEach((element, index) => {
      //   if (element.search(/[j-z]|\(|\&/ig) !== -1) {
      //     // wypisz dziwny element
      //     weirdElements.push(element);
      //     for (let j = 0; j < element.length; j++) {
      //       if (odpArr[index][j] === 'P' || odpArr[index][j] === 'p') {
      //         odpArr[index] = odpArr[index].replace(/p/i, 'F');
      //       }
      //       if (odpArr[index][j] === 'L' || odpArr[index][j] === 'l') {
      //         odpArr[index] = odpArr[index].replace(/l/i, 'B');
      //       }
      //       if (odpArr[index][j] === '(') {
      //         odpArr[index] = odpArr[index].replace(/\(/i, 'C');
      //       }
      //       if (odpArr[index][j] === '&') {
      //         odpArr[index] = odpArr[index].replace(/\&/i, 'G');
      //       }
      //     }
      //   }
      // });
      // console.log(weirdElements);
      // // scal takie sytuacje jak 7, A w 7A.
      // console.log('---');
      // console.log('elementy dziwne zmienione, scalanie pojedynczych np 7 A w 7A');
      // console.log('---');
      // for (let index = 0; index < odpArr.length; index++) {
      //   let element = odpArr[index];
      //   // jesli zawiera cyfry i liczbe to pushuj, jak nie to scal z nastepnym
      //   if (element.match(/[a-h]/i) && element.match(/[1-40]/i)) {
      //     newArr.push(element);
      //   } else {
      //     newArr.push(element + odpArr[index + 1]);
      //     // pomin jeden index żeby nei bylo powtórzeń
      //     index++;
      //   }
      // }

      // // DLA LENGTH === 3
      // // zamien ostatnie cyfry na odpowiednie litery, np 366 to wiadomo ze 36G
      // newArr.forEach((element, index) => {
      //   if (element.length === 3) {
      //     // sytuacja taka ze mamy tylko 3 liczby
      //     if (element.search(/[^1-9]/) === -1) {
      //       if (element[2] === '6') {
      //         newArr[index] = element.substring(0, 2) + 'G';
      //       } else if (element[2] === '8') {
      //         newArr[index] = element.substring(0, 2) + 'B';
      //       } else if (element[2] === '4') {
      //         newArr[index] = element.substring(0, 2) + 'A';
      //       }
      //     }
      //   }
      // });
      // console.log(newArr.toString());
      // console.log('---');
      // console.log(' Zamienic bugi z cyframi, np 16 jak obok nie ma 15 i 17 to znaczy ze ta 6 to G');
      // console.log('To fix: Wariant 1: Nie ma ani cyfry ani odpowiedzi, mamy np 4B,6A. Nalezy wstawic N przed 6, wtedy bedzie ciag odpowiedzi BNA, N to po prostu zla odpowiedz.');
      // console.log('Wariant 2: Jest cyfra nie ma odpowiedzi, mamy np 4B, 5, 6A. Wstaw N przed 6. Fixed dla prostego przypadku dwucyfrowego');
      // // powinno dzialac nawet w przupadku 4B, 56, G7, B8
      // // OMIJA 16
      // // DO NAPRAWY. DOCELOWY ALGORYTM: JESLI JEST LICZBA A PO NIEJ LICZBA+1 to wstaw N pomieedzy nimi!
      // newArr.forEach((element, index) => {
      //   if (element.length === 2) {
      //     if (element.match(/[0-9][0-9]/)) {
      //       // czyli 34 na 3N4
      //       const newElement = element[0] + 'N' + element[1];
      //       newArr[index] = newElement;
      //     }
      //   }
      // });
      // console.log('---');
      // console.log(newArr.toString());
      // console.log('---');
      // console.log('Wariant 3: Jest odpowiedz nie ma cyfry, mamy np 4B, D, 6A. ZROBIONE, bedzie 4B, D6A, nie trzeba wstawiac cyfry.');
      // console.log('Wariant 4: Jest odpowiedz ale jest i cyfra w postaci zle odczytanej liczby, mamy np 3D, AD, 5C. A nalezy zamienic na 4 lub zignorować przy pushowaniu odpowiedzi');
      // console.log('Wariant 5: Przyklad z zycia:  (7,(BD,D,10E  Nie ma 8 ani 9. 8 jest jako B, 9 w ogóle nie odczytana. Zamienic B na 8. Pushnąć pozostałe litery.');
      // //w trakcie
      // console.log('elementy do poprawki:')
      // newArr.forEach((element, index) => {
      //   if (element.length >= 3) {
      //     if (element.match(/[^0-9]/g)) {
      //       // jesli liter jest wiecej niz cyfr w stringu
      //       if (element.match(/[^0-9]/g).length > element.length / 2) {
      //         console.log(element);
      //         // AB5 CBDD
      //         // sprawdzic czy A to nie 4 i czy 8 to nie B
      //         // jesli ostatni char w poprzedniej szufladce jest cyfra, to znaczy ze pierwsza litera z obecnego stringa jest odp dla niego
      //         if ((newArr[index - 1][newArr[index - 1].length - 1]).match(/[0-9]/g)) {
      //           // zignoruj pierwszy char z obecnego stringa
      //           let tempElement = element;
      //           tempElement = tempElement.slice(1, tempElement.length);
      //           // B5 BDD

      //           // wstaw 8 za B jesli w poprzednim jest 7 lub w nastepnym 9
      //           if (tempElement.includes('B')) {
      //             if (newArr[index - 1].includes('7') || newArr[index + 1].includes('9')) {
      //               tempElement = tempElement.replace('B', '8');
      //               // wracamy z powrotem z wycieta odpowiedzia z 0 indeksu
      //               newArr[index] = element[0] + tempElement;
      //             }
      //           }
      //           // wstaw 4 za A jesli w poprzednim jest 3 lub w nastepnym jest 5
      //           if (tempElement.includes('A')) {
      //             if (newArr[index - 1].includes('3') || newArr[index + 1].includes('5')) {
      //               tempElement = tempElement.replace('A', '4');
      //               // wracamy z powrotem z wycieta odpowiedzia z 0 indeksu
      //               newArr[index] = element[0] + tempElement;
      //             }
      //           }
      //           console.log('poprawiony:');
      //           console.log(newArr[index]);
      //         } else {
      //           //mamy LITERE na koncu poprezdniego stringa, wiec obecny string powinien rozpoczynac sie LICZBĄ
      //           // 3D, AB5, C6C7 = > 3D 4B 5C 6C 7
      //           if (newArr[index - 1].includes('3') || newArr[index + 1].includes('5')) {
      //             if (element[0] === 'A' && element[1].match(/[^0-9]/g)) {
      //               newArr[index] = newArr[index][0].replace('A', '4');
      //             }
      //           }
      //           if (newArr[index - 1].includes('7') || newArr[index + 1].includes('9')) {
      //             if (element[0] === 'B' && element[1].match(/[^0-9]/g)) {
      //               newArr[index] = newArr[index][0].replace('B', '8');
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // });
      // console.log('pattern ktory sie powtarza: odpCyfraOdpCyfraOdp... Jak zweryfikowac czy mamy do czynienia z dwucyfrową liczba czy np 14 to 1A?');

      // //tbd




      // console.log('---');
      // console.log('Pushowanie docelowych odpowiedzi z poprawionego arraya');
      // console.log('z jednocyfrowych liczb //tbd');
      // console.log('Z dwucyfrowych liczb //done:');
      // newArr.forEach((element, index) => {
      //   if (element.length >= 3) {
      //     if (element.match(/[1-4][0-9]/)) {
      //       const occurences = element.match(/[1-4][0-9]/g);
      //       let tempElement = element;
      //       if (occurences) {
      //         occurences.forEach(el => {
      //           // usun liczbe z elementu
      //           tempElement = tempElement.replace(el, '');
      //         });
      //         for (let j = 0; j < tempElement.length; j++) {
      //           answersToCompare.push(tempElement[j]);
      //           // pushnij wszystkie literki
      //         }
      //       }
      //     }
      //   }
      // });
      // console.log('---');
      // console.log(newArr.toString());
      // console.log('---');






      // odpArr.forEach((element, index) => {
      //   // sprawdz czy 4 nie czyta jako A lub 8 jako B:
      //   // ------------------------------------- AA                           1odpA
      //   if (element === 'A' || element.search(/A[^0-9]/i) || element.search(/[1-3][^0-9][A]/i) || element.search(/[1-3][A][^0-9]/i)) {
      //     // jesli poprzedni/poprzedni-1 zawiera 3 lub nastepny/nastepny+1 zawiera 5 to znaczy ze nie mamy do czynienia z A tylko z 4
      //     if (
      //       odpArr[index - 1].search(/[3,13,23,33]/) || odpArr[index - 2].search(/[3,13,23,33]/)
      //       || odpArr[index + 1].search(/[5,15,25,35]/) || odpArr[index + 2].search(/[5,15,25,35]/)
      //     ) {
      //       // mamy samo A wiec nie rob nic bo to czworka np 2B, 3C, A, D5,

      //       // mamy AB wiec A to czworka a B to odpowiedz
      //       if (element.length === 2) {
      //         // kolejnosci nigdy nie myli wiec bedzie np AB, wiec pushnij drugi
      //         newArrSize = newArr.push(element[1]);
      //         // if numberOfAnswers === liczbaOdpzQr to RETURN
      //       } else if (element.length === 3) {
      //         // mamy np 1AA lub AAA (najgorsyz wariant), lub A1A
      //         let charsIndexes = [];
      //         for (let i = 0; i < element.length; i++) {
      //           if (element[i].match(/[A]/)) {
      //             charsIndexes.push(i);
      //           }
      //           if (charsIndexes.length === 3) {
      //             //pushnij tylko dwie odp, skoro srodkowa to np 4 odczytane jako A
      //             newArrSize = newArr.push(charsIndexes[0], charsIndexes[1]);
      //           } else if (charsIndexes.length === 2) {
      //             //np 3BA to pushnij tylko jedna
      //             newArrSize = newArr.push(charsIndexes[0])
      //           }
      //         }
      //         newArrSize = newArr.push(element[2]);
      //         // if numberOfAnswers === liczbaOdpzQr to RETURN
      //       }


      //     }
      //   } else if (eightCorrected) {
      //     // dla ósemki
      //   } else {
      //     // jesli format jest 1X badz 1XX - pushnij literke
      //     if (element.length === 2) {
      //       // [[^0-9]] wszystko co nie jest liczbą
      //       const charIndex = element.search(/[^0-9]/i);
      //       newArrSize = newArr.push(element[charIndex]);
      //       // if numberOfAnswers === liczbaOdpzQr to RETURN
      //     }
      //     if (element.length === 3) {

      //       let charsIndexes = [];
      //       for (let i = 0; i < element.length; i++) {
      //         if (element[i].match(/[(]|[a-g]|[L]|[&]/)) {
      //           charsIndexes.push(i);
      //         }
      //       }
      //     } else {
      //       // format jest X
      //       newArrSize = newArr.push(element);
      //     }


      //   }

      //   // jesli format jest sama cyfra, sprawdz czy w poprzednim elemencie jest cyfra-1, jesli tak to wejdz w nastepny element i wez literke - push

      //   if (element.length === 2) {


      //   }
      //   // dodaj jeszcze ze jak jest cyfra i w nast el jest cyfra to wpisz n
      // })




    }














    // async presentToastWithOptions() {
    //   const toast = await this.toastController.create({
    //     header: 'Imie i Nazwisko',
    //     message: 'Wynik',
    //     position: 'bottom',
    //     buttons: [
    //       {
    //         side: 'start',
    //         icon: 'checkbox-outline',
    //         text: 'Zapisz ocene',
    //         handler: () => {
    //           // dodać obsługę i do firestora cyk
    //           console.log('Zapisano ocene');
    //         }
    //       }, {
    //         text: 'Cofnij',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       }
    //     ]
    //   });
    //   toast.present();
    // }




  }
}