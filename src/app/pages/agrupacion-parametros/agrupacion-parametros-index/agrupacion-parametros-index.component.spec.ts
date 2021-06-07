import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupacionParametrosIndexComponent } from './agrupacion-parametros-index.component';

describe('AgrupacionParametrosIndexComponent', () => {
  let component: AgrupacionParametrosIndexComponent;
  let fixture: ComponentFixture<AgrupacionParametrosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrupacionParametrosIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrupacionParametrosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
