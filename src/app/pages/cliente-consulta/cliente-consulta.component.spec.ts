import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteConsultaComponent } from './cliente-consulta.component';

describe('ClienteConsultaComponent', () => {
  let component: ClienteConsultaComponent;
  let fixture: ComponentFixture<ClienteConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteConsultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
