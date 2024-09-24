import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { ReportDto } from '../../Core/Model/ReportDto';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  reportForm: FormGroup;
  files: File[] = [];
  formError: string = '';


  constructor(private fb: FormBuilder, private reportService: ReportServiceImpl) {
    this.reportForm = this.fb.group({
      afiliacionId: [''],
      nombre: [''],
      apellidos: [''],
      descripcion: [''],
      email: ['', Validators.email],
      telefono: [''],
    }, { validator: this.customValidator });

  }

  customValidator(group: FormGroup) {
    const afiliacionId = group.get('afiliacionId').value;
    const nombre = group.get('nombre').value;
    const email = group.get('email').value;
    const telefono = group.get('telefono').value;

    if (afiliacionId || (nombre && email) || (nombre && telefono)) {
      return null;
    }

    return { invalidForm: true };
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  onSubmit() {

    if (this.reportForm.valid) {

      const report: ReportDto = {
        ...this.reportForm.value,
        attachments: this.files
      };

      this.reportService.createReport(report).subscribe({
        next: (response) => {
          console.log('Reporte enviado con éxito', response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al enviar el reporte', error);
          // Aquí puedes manejar diferentes tipos de errores
          if (error.status === 0) {
            console.error('Ha ocurrido un error de red. Por favor, verifica tu conexión.');
          } else {
            console.error(`Backend retornó código ${error.status}, cuerpo era: ${error.error}`);
          }
        }
      })
    }else {
      console.error('Por favor, complete el ID de Afiliación, o el Nombre junto con el Email o Teléfono. ');
      alert('Por favor, complete el ID de Afiliación, o el Nombre junto con el Email o Teléfono. Es necesario que complete alguno de los datos para poder porceder con la creación del reporte.');
    }
  }
}