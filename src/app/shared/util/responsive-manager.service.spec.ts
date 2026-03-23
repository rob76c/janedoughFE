import { TestBed } from '@angular/core/testing';

import { ResponsiveManagerService } from './responsive-manager.service';

describe('ResponsiveManagerService', () => {
  let service: ResponsiveManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
