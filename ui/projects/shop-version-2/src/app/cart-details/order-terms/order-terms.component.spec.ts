import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTermsComponent } from './order-terms.component';

describe('OrderTermsComponent', () => {
  let component: OrderTermsComponent;
  let fixture: ComponentFixture<OrderTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
