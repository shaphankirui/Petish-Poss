import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordMainComponent } from './dashbord-main.component';

describe('DashbordMainComponent', () => {
  let component: DashbordMainComponent;
  let fixture: ComponentFixture<DashbordMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashbordMainComponent]
    });
    fixture = TestBed.createComponent(DashbordMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
