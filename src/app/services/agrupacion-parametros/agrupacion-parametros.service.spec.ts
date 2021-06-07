import { TestBed, inject } from '@angular/core/testing';

import { AgrupacionParametrosService } from './agrupacion-parametros.service';

describe('AgrupacionParametrosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgrupacionParametrosService]
    });
  });

  it('should be created', inject([AgrupacionParametrosService], (service: AgrupacionParametrosService) => {
    expect(service).toBeTruthy();
  }));
});
