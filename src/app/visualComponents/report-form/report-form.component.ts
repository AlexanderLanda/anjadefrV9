import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { ReportDto } from '../../Core/Model/ReportDto';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpErrorResponse } from '@angular/common/http';
import { DeporteServiceImpl } from 'src/app/Core/Service/Implements/DeporteServiceImpl';
import { ProvinciasServiceImpl } from 'src/app/Core/Service/Implements/ProvinciasServiceImpl';
import { ProvinciaDto } from 'src/app/Core/Model/ProvinciaDto';
import { PROVINCIAS } from '../../constants/provinces';
import { DeportesDto } from 'src/app/Core/Model/DeportesDto';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  reportForm: FormGroup;
  files: File[] = [];
  formError: string = '';
  selectedProvincia = '';
  selectedDeporte = '';
  provincias: ProvinciaDto[] | undefined;
  deportes: DeportesDto[] | undefined;
  cargando = false; // Indicador de carga
  mensajeExito = ''; // Mensaje de éxito


  constructor(private fb: FormBuilder, private reportService: ReportServiceImpl,
    private deportesService: DeporteServiceImpl,private provinciasService: ProvinciasServiceImpl,) {
    this.reportForm = this.fb.group({
      afiliacionId: [''],
      nombre: [''],
      apellidos: [''],
      descripcion: [''],
      email: ['', Validators.email],
      telefono: [''],
      provincia: ['', [Validators.required]],
      deporte: ['', [Validators.required]],
    }, { validator: this.customValidator });

  }

  ngOnInit() {
    this.cargarDeportesComboBox();
    this.cargarProvinciasComboBox();
  }

  customValidator(group: FormGroup) {
    const afiliacionId = group.get('afiliacionId').value;
    const nombre = group.get('nombre').value;
    const email = group.get('email').value;
    const telefono = group.get('telefono').value;
    const provincia = group.get('provincia').value;
    const deporte = group.get('deporte').value;
  
    let errors = {};
  
    if (!(afiliacionId || (nombre && email) || (nombre && telefono))) {
      errors['invalidIdentification'] = true;
    }
  
    if (!provincia || !deporte) {
      errors['invalidSelection'] = true;
    }
  
    return Object.keys(errors).length > 0 ? errors : null;
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  onSubmit() {
    if (this.reportForm.valid) {
      this.cargando = true; // Inicia el indicador de carga
      this.mensajeExito = ''; // Limpia el mensaje de éxito previo
      const report: ReportDto = {
        ...this.reportForm.value,
        attachments: this.files
      };

      if (typeof this.provincias !== 'undefined') {
        const provinciasObject = this.provincias.find(loc => loc.id === Number(report.provincia));
        console.info(provinciasObject)
        if (provinciasObject) {
          report.provincia = provinciasObject;
        }
      }
      // Deportes
      if (typeof this.deportes !== 'undefined') {
        const deportesObject = this.deportes.find(loc => loc.id === Number(report.deporte));
        console.info(deportesObject)
        if (deportesObject) {
          report.deporte = deportesObject;
        }
      }
  
      this.reportService.createReport(report).subscribe({
        next: (response) => {
          this.cargando = false; // Finaliza el indicador de carga
          this.mensajeExito = 'Creacion de Reporte sobre suceso correctamente';
          this.reportForm.reset();
          console.log('Reporte enviado con éxito', response);
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false; // Finaliza el indicador de carga
          console.error('Error al enviar el reporte', error);
          if (error.status === 0) {
            this.cargando = false; // Finaliza el indicador de carga
            console.error('Ha ocurrido un error de red. Por favor, verifica tu conexión.');
          } else {
            this.cargando = false; // Finaliza el indicador de carga
            console.error(`Backend retornó código ${error.status}, cuerpo era: ${error.error}`);
          }
        }
      });
    } else {
      const errors = this.reportForm.errors;
      if (errors['invalidIdentification']) {
        this.cargando = false; // Finaliza el indicador de carga
        console.error('Por favor, complete el ID de Afiliación, o el Nombre junto con el Email o Teléfono.');
        alert('Por favor, complete el ID de Afiliación, o el Nombre junto con el Email o Teléfono. Es necesario que complete alguno de los datos para poder proceder con la creación del reporte.');
      }
      if (errors['invalidSelection']) {
        this.cargando = false; // Finaliza el indicador de carga
        console.error('Por favor, seleccione una provincia y un deporte.');
        alert('Es obligatorio seleccionar una provincia y un deporte para crear el reporte.');
      }
    }
  }

  cargarDeportesComboBox() {

    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }

  cargarProvinciasComboBox() {

    
    this.provinciasService.getProvincias().subscribe(provincias => {
      this.provincias = provincias;
    })

  }
}