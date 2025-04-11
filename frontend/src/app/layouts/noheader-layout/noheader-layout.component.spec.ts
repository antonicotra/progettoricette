import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoheaderLayoutComponent } from './noheader-layout.component';

describe('NoheaderLayoutComponent', () => {
  let component: NoheaderLayoutComponent;
  let fixture: ComponentFixture<NoheaderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoheaderLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoheaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
