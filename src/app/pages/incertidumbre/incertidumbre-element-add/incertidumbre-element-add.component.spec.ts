import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncertidumbreElementAddComponent } from './incertidumbre-element-add.component';

describe('IncertidumbreElementAddComponent', () => {
  let component: IncertidumbreElementAddComponent;
  let fixture: ComponentFixture<IncertidumbreElementAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncertidumbreElementAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncertidumbreElementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
