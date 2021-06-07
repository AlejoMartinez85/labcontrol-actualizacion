import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoViewComponent } from './resultado-view.component';

describe('ResultadoViewComponent', () => {
  let component: ResultadoViewComponent;
  let fixture: ComponentFixture<ResultadoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
