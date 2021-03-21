import { TestBed } from '@angular/core/testing';

import { StudentAuthGuard } from './studentAuth.guard';

describe('StudentAuthGuard', () => {
  let guard: StudentAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StudentAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
