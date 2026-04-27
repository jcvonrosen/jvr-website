import { TestBed } from '@angular/core/testing';

import { PhpProvider } from './php.provider';

describe('PhpProvider', () => {
  let service: PhpProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhpProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
