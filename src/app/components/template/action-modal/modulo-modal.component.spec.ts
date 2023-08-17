import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloModalComponent } from './modulo-modal.component';

describe('ModuloModalComponent', () => {
  let component: ModuloModalComponent;
  let fixture: ComponentFixture<ModuloModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
