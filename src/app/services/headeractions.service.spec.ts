import { TestBed } from '@angular/core/testing';

import { HeaderactionsService } from './headeractions.service';

describe('HeaderactionsService', () => {
  let service: HeaderactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
