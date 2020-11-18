import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSideNavListComponent } from './admin-side-nav-list.component';

describe('AdminSideNavListComponent', () => {
  let component: AdminSideNavListComponent;
  let fixture: ComponentFixture<AdminSideNavListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSideNavListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSideNavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
