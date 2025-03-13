import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipecardComponent } from './recipecard.component';

describe('RecipecardComponent', () => {
  let component: RecipecardComponent;
  let fixture: ComponentFixture<RecipecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipecardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
