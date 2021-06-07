import { TestBed, inject } from '@angular/core/testing';

import { InvitacionService } from './invitacion.service';

describe('InvitacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvitacionService]
    });
  });

  it('should be created', inject([InvitacionService], (service: InvitacionService) => {
    expect(service).toBeTruthy();
  }));
});
