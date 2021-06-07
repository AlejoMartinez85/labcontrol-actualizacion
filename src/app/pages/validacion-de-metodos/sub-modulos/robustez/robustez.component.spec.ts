import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobustezComponent } from './robustez.component';

describe('RobustezComponent', () => {
  let component: RobustezComponent;
  let fixture: ComponentFixture<RobustezComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobustezComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobustezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
