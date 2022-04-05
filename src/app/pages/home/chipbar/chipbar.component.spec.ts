import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipbarComponent } from './chipbar.component';

describe('ChipbarComponent', () => {
  let component: ChipbarComponent;
  let fixture: ComponentFixture<ChipbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
