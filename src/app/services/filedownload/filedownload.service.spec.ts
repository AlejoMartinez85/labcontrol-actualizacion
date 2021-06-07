import { TestBed, inject } from '@angular/core/testing';

import { FiledownloadService } from './filedownload.service';

describe('FiledownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiledownloadService]
    });
  });

  it('should be created', inject([FiledownloadService], (service: FiledownloadService) => {
    expect(service).toBeTruthy();
  }));
});
