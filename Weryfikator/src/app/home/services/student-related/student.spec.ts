import { Student } from './student';

describe('Student', () => {
  it('should create an instance', () => {
    expect(new Student(100440, '10%')).toBeTruthy();
  });
});
