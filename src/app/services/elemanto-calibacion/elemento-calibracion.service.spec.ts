import { TestBed, inject } from '@angular/core/testing';

import { ElementoCalibracionService } from './elemento-calibracion.service';

describe('ElementoCalibracionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElementoCalibracionService]
    });
  });

  it('should be created', inject([ElementoCalibracionService], (service: ElementoCalibracionService) => {
    expect(service).toBeTruthy();
  }));
});
