
export class Student {
  indexNumber;
  group;
  name;
  surname;
  examName;
  grade;
  points;

  constructor(iN, gr, name, surname, examName, grade, points) {
    this.indexNumber = iN;
    this.group = gr;
    this.name = name;
    this.surname = surname;
    this.examName = examName;
    this.grade = grade;
    this.points = points;
  }

}
