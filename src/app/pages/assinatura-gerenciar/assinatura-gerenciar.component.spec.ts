import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssinaturaGerenciarComponent } from './assinatura-gerenciar.component';

describe('AssinaturaGerenciarComponent', () => {
  let component: AssinaturaGerenciarComponent;
  let fixture: ComponentFixture<AssinaturaGerenciarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssinaturaGerenciarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssinaturaGerenciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
