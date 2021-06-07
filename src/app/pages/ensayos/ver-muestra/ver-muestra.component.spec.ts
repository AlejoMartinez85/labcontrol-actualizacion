import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMuestraComponent } from './ver-muestra.component';

describe('VerMuestraComponent', () => {
  let component: VerMuestraComponent;
  let fixture: ComponentFixture<VerMuestraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerMuestraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMuestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
