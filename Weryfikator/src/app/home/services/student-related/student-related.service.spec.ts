import { TestBed } from '@angular/core/testing';

import { StudentRelatedService } from './student-related.service';

describe('StudentRelatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentRelatedService = TestBed.get(StudentRelatedService);
    expect(service).toBeTruthy();
  });
});
