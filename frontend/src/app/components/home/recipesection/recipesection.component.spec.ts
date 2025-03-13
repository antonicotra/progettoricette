import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesectionComponent } from './recipesection.component';

describe('RecipesectionComponent', () => {
  let component: RecipesectionComponent;
  let fixture: ComponentFixture<RecipesectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
