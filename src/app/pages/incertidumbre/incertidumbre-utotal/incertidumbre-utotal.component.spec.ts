import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreUtotalComponent } from './incertidumbre-utotal.component';

describe('IncertidumbreUtotalComponent', () => {
  let component: IncertidumbreUtotalComponent;
  let fixture: ComponentFixture<IncertidumbreUtotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreUtotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreUtotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
