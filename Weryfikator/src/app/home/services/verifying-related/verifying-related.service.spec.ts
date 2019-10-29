import { TestBed } from '@angular/core/testing';

import { VerifyingRelatedService } from './verifying-related.service';

describe('VerifyingRelatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerifyingRelatedService = TestBed.get(VerifyingRelatedService);
    expect(service).toBeTruthy();
  });
});
