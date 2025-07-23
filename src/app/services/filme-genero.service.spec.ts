import { TestBed } from '@angular/core/testing';

import { FilmeGeneroService } from './filme-genero.service';

describe('FilmeGeneroService', () => {
  let service: FilmeGeneroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmeGeneroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
