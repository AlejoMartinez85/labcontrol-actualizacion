import { TestBed, inject } from '@angular/core/testing';

import { EnsayoService } from './ensayo.service';

describe('EnsayoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnsayoService]
    });
  });

  it('should be created', inject([EnsayoService], (service: EnsayoService) => {
    expect(service).toBeTruthy();
  }));
});
