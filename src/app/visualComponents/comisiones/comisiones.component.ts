import { Component, OnInit } from '@angular/core';
import { DeportesDto } from 'src/app/Core/Model/DeportesDto';
import { DeporteServiceImpl } from 'src/app/Core/Service/Implements/DeporteServiceImpl';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.css']
})
export class ComisionesComponent implements OnInit {

  deportes: DeportesDto[];

  constructor(private deportesService: DeporteServiceImpl) { }

  ngOnInit(): void {
    this.cargarDeportesComboBox();
  }

  cargarDeportesComboBox() {

    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }
}
