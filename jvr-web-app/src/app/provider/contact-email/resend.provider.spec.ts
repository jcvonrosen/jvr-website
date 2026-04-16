import { TestBed } from '@angular/core/testing';

import { ResendProvider } from './resend.provider';

describe('ResendProvider', () => {
  let service: ResendProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResendProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
