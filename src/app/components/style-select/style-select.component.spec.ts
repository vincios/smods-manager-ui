import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleSelectComponent } from './style-select.component';

describe('StyleSelectComponent', () => {
  let component: StyleSelectComponent;
  let fixture: ComponentFixture<StyleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyleSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
