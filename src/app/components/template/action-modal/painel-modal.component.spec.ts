import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelModalComponent } from './painel-modal.component';

describe('PainelModalComponent', () => {
  let component: PainelModalComponent;
  let fixture: ComponentFixture<PainelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
