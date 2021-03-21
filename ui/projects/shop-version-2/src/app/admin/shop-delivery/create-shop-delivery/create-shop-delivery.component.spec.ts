import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShopDeliveryComponent } from './create-shop-delivery.component';

describe('CreateShopDeliveryComponent', () => {
  let component: CreateShopDeliveryComponent;
  let fixture: ComponentFixture<CreateShopDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShopDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShopDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
