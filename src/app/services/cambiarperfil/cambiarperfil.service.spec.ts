import { TestBed, inject } from '@angular/core/testing';

import { CambiarperfilService } from './cambiarperfil.service';

describe('CambiarperfilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambiarperfilService]
    });
  });

  it('should be created', inject([CambiarperfilService], (service: CambiarperfilService) => {
    expect(service).toBeTruthy();
  }));
});
