import { TestBed } from '@angular/core/testing';

import { LocalServerService } from './local-server.service';

describe('LocalServerService', () => {
  let service: LocalServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
