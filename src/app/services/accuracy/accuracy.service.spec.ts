import { TestBed, inject } from '@angular/core/testing';

import { AccuracyService } from './accuracy.service';

describe('AccuracyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccuracyService]
    });
  });

  it('should be created', inject([AccuracyService], (service: AccuracyService) => {
    expect(service).toBeTruthy();
  }));
});
