import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModOperationsComponent } from './mod-operations.component';

describe('ModOperationsComponent', () => {
  let component: ModOperationsComponent;
  let fixture: ComponentFixture<ModOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
