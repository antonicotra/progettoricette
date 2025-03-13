import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesboxComponent } from './categoriesbox.component';

describe('CategoriesboxComponent', () => {
  let component: CategoriesboxComponent;
  let fixture: ComponentFixture<CategoriesboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
