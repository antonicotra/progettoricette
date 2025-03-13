import { TestBed } from '@angular/core/testing';
import { CategorySelectedService } from './categoryselected.service';


describe('CategoryFilterService', () => {
  let service: CategorySelectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorySelectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
