import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesboxComponent } from './recipesbox.component';

describe('RecipesboxComponent', () => {
  let component: RecipesboxComponent;
  let fixture: ComponentFixture<RecipesboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
