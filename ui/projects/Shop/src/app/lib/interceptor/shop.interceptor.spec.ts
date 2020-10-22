import { TestBed } from '@angular/core/testing';

import { ShopInterceptor } from './shop.interceptor';

describe('ShopInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ShopInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ShopInterceptor = TestBed.inject(ShopInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
