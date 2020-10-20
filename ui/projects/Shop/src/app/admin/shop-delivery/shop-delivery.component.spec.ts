import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDeliveryComponent } from './shop-delivery.component';

describe('ShopDeliveryComponent', () => {
  let component: ShopDeliveryComponent;
  let fixture: ComponentFixture<ShopDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
