import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoCadastroComponent } from './avaliacao-cadastro.component';

describe('AvaliacaoCadastroComponent', () => {
  let component: AvaliacaoCadastroComponent;
  let fixture: ComponentFixture<AvaliacaoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacaoCadastroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaliacaoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
