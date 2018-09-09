import { TestBed, inject } from '@angular/core/testing';

import { XoService } from './xo.service';

describe('XoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XoService]
    });
  });

  it('should be created', inject([XoService], (service: XoService) => {
    expect(service).toBeTruthy();
  }));
});
