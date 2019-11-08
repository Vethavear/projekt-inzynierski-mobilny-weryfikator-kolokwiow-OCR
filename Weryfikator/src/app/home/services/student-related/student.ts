
export class Student {
  indexNumber;
  group;
  name;
  surname;
  examName;
  grade;
  points;
  answersArr;
  correctAnswersArr;
  examDate;

  constructor(iN, gr, name, surname, examName) {
    this.indexNumber = iN;
    this.group = gr;
    this.name = name;
    this.surname = surname;
    this.examName = examName;
  }

}
