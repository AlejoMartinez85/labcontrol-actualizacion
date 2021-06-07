import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreAddComponent } from './incertidumbre-add.component';

describe('IncertidumbreAddComponent', () => {
  let component: IncertidumbreAddComponent;
  let fixture: ComponentFixture<IncertidumbreAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
