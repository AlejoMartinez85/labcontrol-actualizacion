import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCliComponent } from './solicitud-cli.component';

describe('SolicitudCliComponent', () => {
  let component: SolicitudCliComponent;
  let fixture: ComponentFixture<SolicitudCliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
