import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModActionsComponent } from './mod-actions.component';

describe('ModActionsComponent', () => {
  let component: ModActionsComponent;
  let fixture: ComponentFixture<ModActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
