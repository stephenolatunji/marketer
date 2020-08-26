import { TestBed } from '@angular/core/testing';

import { BdrLockService } from './bdr-lock.service';

describe('BdrLockService', () => {
  let service: BdrLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdrLockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
