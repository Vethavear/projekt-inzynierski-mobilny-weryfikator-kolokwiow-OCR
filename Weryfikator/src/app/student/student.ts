export class Student {
  name: string;
  surname: string;
  year: number;
  group: string;
  grade: string;

  constructor(n: string, s: string, y: number, g: string, gr: string) {
    this.name = n;
    this.surname = s;
    this.year = y;
    this.group = g;
    this.grade = gr;
  }

}
