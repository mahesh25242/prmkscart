import { TestBed } from '@angular/core/testing';

import { ShopProductService } from './shop-product.service';

describe('ShopProductService', () => {
  let service: ShopProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
