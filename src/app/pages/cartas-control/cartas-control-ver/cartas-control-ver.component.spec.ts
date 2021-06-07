import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartasControlVerComponent } from './cartas-control-ver.component';

describe('CartasControlVerComponent', () => {
  let component: CartasControlVerComponent;
  let fixture: ComponentFixture<CartasControlVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartasControlVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartasControlVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
