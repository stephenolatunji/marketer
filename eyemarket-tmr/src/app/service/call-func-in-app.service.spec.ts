import { TestBed } from '@angular/core/testing';

import { CallFuncInAppService } from './call-func-in-app.service';

describe('CallFuncInAppService', () => {
  let service: CallFuncInAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallFuncInAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
