import { TestBed, inject } from '@angular/core/testing';

import { MuestraService } from './muestra.service';

describe('MuestraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MuestraService]
    });
  });

  it('should be created', inject([MuestraService], (service: MuestraService) => {
    expect(service).toBeTruthy();
  }));
});
