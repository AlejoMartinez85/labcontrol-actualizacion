import { TestBed, inject } from '@angular/core/testing';

import { VariablesConfiguracionService } from './variables-configuracion.service';

describe('VariablesConfiguracionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VariablesConfiguracionService]
    });
  });

  it('should be created', inject([VariablesConfiguracionService], (service: VariablesConfiguracionService) => {
    expect(service).toBeTruthy();
  }));
});
