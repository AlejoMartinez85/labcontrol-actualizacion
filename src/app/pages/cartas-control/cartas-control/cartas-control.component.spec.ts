import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartasControlComponent } from './cartas-control.component';

describe('CartasControlComponent', () => {
  let component: CartasControlComponent;
  let fixture: ComponentFixture<CartasControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartasControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartasControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
