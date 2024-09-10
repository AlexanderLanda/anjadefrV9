import { Component, OnInit } from '@angular/core';
import { DeportesDto } from 'src/app/Core/Model/DeportesDto';
import { DeporteServiceImpl } from 'src/app/Core/Service/Implements/DeporteServiceImpl';
import { UsuariosServiceImpl } from 'src/app/Core/Service/Implements/UsuariosServiceImpl';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.css']
})
export class ComisionesComponent implements OnInit {

  aux ={"apellidos":"Any","nombre":"Any","documento":"Eeed","fechaNacimiento":"2024-10-03","tipoDocumento":{"id":1,"descripcion":"DNI"},"direccion":"Any","codigoPostal":"12312","localidad":"Any","provincia":{"id":2,"descripcion":"Albacete"},"correo":"any@any.com","telefono":"123123123","deporte":{"id":44,"nombre":"Futbol"},"afiliadosFuncion":{"id":7,"descripcion":"Delegado(a)"},"afiliadosCategoria":{"id":2,"descripcion":"Profesional"},"tipoPago":{"id":4,"descripcion":"Caja"},"situacionActual":"Ex","usuariorol":{"id":"3","descripcion":"afiliados"}};

  deportes: DeportesDto[];

  constructor(    private usuariosService: UsuariosServiceImpl,
    private deportesService: DeporteServiceImpl) { }

  ngOnInit(): void {
    this.cargarDeportesComboBox();
  }

  cargarDeportesComboBox() {

    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }

  botonPrueba(){
    this.usuariosService.saveOrUpdate(this.aux).subscribe(
      response => {
        console.log('Datos registrados con éxito:', response);
        // Aquí puedes agregar cualquier otra lógica después de enviar los datos
        alert("Funcionamiento Perfecto");
      },
      error => {
        alert("No funciona");
        console.error('Error al registrar los datos:', error);
        //alert('Tenemos problemas al registrar los datos. Por favor refresque o actualice la página(F5) y vuelva a intentarlo. Si el problema sigue, contacte con administración.');
        // Manejo de errores
      }
    );  }
}
