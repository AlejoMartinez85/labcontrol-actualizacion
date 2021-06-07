import { TestBed, inject } from '@angular/core/testing';

import { ParametroCalibacionService } from './parametro-calibacion.service';

describe('ParametroCalibacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParametroCalibacionService]
    });
  });

  it('should be created', inject([ParametroCalibacionService], (service: ParametroCalibacionService) => {
    expect(service).toBeTruthy();
  }));
});
