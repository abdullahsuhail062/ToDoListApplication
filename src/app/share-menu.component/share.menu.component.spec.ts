import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareMenuComponent } from './share.menu.component';

describe('ShareMenuCompoennt', () => {
  let component: ShareMenuComponent;
  let fixture: ComponentFixture<ShareMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
