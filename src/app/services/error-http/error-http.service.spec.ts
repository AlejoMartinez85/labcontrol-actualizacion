import { TestBed, inject } from '@angular/core/testing';

import { ErrorHttpService } from './error-http.service';

describe('ErrorHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHttpService]
    });
  });

  it('should be created', inject([ErrorHttpService], (service: ErrorHttpService) => {
    expect(service).toBeTruthy();
  }));
});
