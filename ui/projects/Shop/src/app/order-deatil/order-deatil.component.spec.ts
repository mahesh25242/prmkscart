import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeatilComponent } from './order-deatil.component';

describe('OrderDeatilComponent', () => {
  let component: OrderDeatilComponent;
  let fixture: ComponentFixture<OrderDeatilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeatilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
