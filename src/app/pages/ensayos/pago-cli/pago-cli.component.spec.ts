import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoCliComponent } from './pago-cli.component';

describe('PagoCliComponent', () => {
  let component: PagoCliComponent;
  let fixture: ComponentFixture<PagoCliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
