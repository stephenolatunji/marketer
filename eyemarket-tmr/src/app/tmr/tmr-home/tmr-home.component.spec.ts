import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmrHomeComponent } from './tmr-home.component';

describe('TmrHomeComponent', () => {
  let component: TmrHomeComponent;
  let fixture: ComponentFixture<TmrHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmrHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmrHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
