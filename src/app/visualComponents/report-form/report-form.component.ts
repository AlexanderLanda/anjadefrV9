import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { ReportDto } from '../../Core/Model/ReportDto';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule


@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  reportForm: FormGroup;
  files: File[] = [];

  constructor(private fb: FormBuilder, private reportService: ReportServiceImpl) {
    this.reportForm = this.fb.group({
      afiliacionId: [''],
      nombre: [''],
      apellidos: [''],
      descripcion: ['']
    });
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  onSubmit() {
    const report: ReportDto = {
      ...this.reportForm.value,
      files: this.files
    };
    this.reportService.createReport(report).subscribe(response => {
      console.log('Report created', response);
      // handle success, e.g., reset form, show a message, etc.
    });
  }
}
