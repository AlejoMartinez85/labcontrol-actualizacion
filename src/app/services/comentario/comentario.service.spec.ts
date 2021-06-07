import { TestBed, inject } from '@angular/core/testing';

import { ComentarioService } from './comentario.service';

describe('ComentarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComentarioService]
    });
  });

  it('should be created', inject([ComentarioService], (service: ComentarioService) => {
    expect(service).toBeTruthy();
  }));
});
