import { TestBed } from '@angular/core/testing';

import { ShopCategoryService } from './shop-category.service';

describe('ShopCategoryService', () => {
  let service: ShopCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
