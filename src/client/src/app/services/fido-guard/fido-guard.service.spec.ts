import { TestBed, inject } from '@angular/core/testing';

import { FidoGuardService } from './fido-guard.service';

describe('FidoGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FidoGuardService]
    });
  });

  it('should be created', inject([FidoGuardService], (service: FidoGuardService) => {
    expect(service).toBeTruthy();
  }));
});
