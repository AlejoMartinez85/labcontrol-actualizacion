import { TestBed, inject } from '@angular/core/testing';

import { EvaluarService } from './evaluar.service';

describe('EvaluarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluarService]
    });
  });

  it('should be created', inject([EvaluarService], (service: EvaluarService) => {
    expect(service).toBeTruthy();
  }));
});
