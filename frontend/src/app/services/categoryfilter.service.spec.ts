import { TestBed } from '@angular/core/testing';
import { CategoryFilterService } from './categoryfilter.service';


describe('CategoryFilterService', () => {
  let service: CategoryFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
