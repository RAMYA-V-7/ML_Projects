import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrstComponent } from './frst.component';

describe('FrstComponent', () => {
  let component: FrstComponent;
  let fixture: ComponentFixture<FrstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
