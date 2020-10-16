import { TestBed } from '@angular/core/testing';

import { ShopProductCategoryService } from './shop-product-category.service';

describe('ShopProductCategoryService', () => {
  let service: ShopProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopProductCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
