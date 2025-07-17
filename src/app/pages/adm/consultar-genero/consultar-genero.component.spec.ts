import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarGeneroComponent } from './consultar-genero.component';

describe('ConsultarGeneroComponent', () => {
  let component: ConsultarGeneroComponent;
  let fixture: ComponentFixture<ConsultarGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarGeneroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
