import { TestBed, inject } from '@angular/core/testing';

import { LaboratorioService } from './laboratorio.service';

describe('LaboratorioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LaboratorioService]
    });
  });

  it('should be created', inject([LaboratorioService], (service: LaboratorioService) => {
    expect(service).toBeTruthy();
  }));
});
