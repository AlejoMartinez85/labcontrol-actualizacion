import { TestBed, inject } from '@angular/core/testing';

import { ParametroService } from './parametro.service';

describe('ParametroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParametroService]
    });
  });

  it('should be created', inject([ParametroService], (service: ParametroService) => {
    expect(service).toBeTruthy();
  }));
});
