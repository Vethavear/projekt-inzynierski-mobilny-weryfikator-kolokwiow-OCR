import { TestBed } from '@angular/core/testing';

import { CameraRelatedService } from './camera-related.service';

describe('CameraRelatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CameraRelatedService = TestBed.get(CameraRelatedService);
    expect(service).toBeTruthy();
  });
});
