import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorybuttonComponent } from './categorybutton.component';

describe('CategorybuttonComponent', () => {
  let component: CategorybuttonComponent;
  let fixture: ComponentFixture<CategorybuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorybuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorybuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
