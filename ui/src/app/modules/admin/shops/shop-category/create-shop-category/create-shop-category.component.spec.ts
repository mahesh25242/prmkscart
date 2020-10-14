import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShopCategoryComponent } from './create-shop-category.component';

describe('CreateShopCategoryComponent', () => {
  let component: CreateShopCategoryComponent;
  let fixture: ComponentFixture<CreateShopCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShopCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShopCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
