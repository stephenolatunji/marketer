import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportuntyComponent } from './opportunty.component';

describe('OpportuntyComponent', () => {
  let component: OpportuntyComponent;
  let fixture: ComponentFixture<OpportuntyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportuntyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportuntyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
