import { TestBed } from '@angular/core/testing';

import { TmrAuthService } from './tmr-auth.service';

describe('TmrAuthService', () => {
  let service: TmrAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmrAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
