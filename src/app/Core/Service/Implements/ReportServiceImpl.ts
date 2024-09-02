// report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDto } from '../../Model/ReportDto';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReportServiceImpl {
   private apiUrl = environment.apiUrl+'/api/v1/reports';

  constructor(private http: HttpClient) { }

  createReport(report: ReportDto): Observable<ReportDto> {
    const formData: FormData = new FormData();
    formData.append('afiliacionId', report.afiliacionId);
    formData.append('nombre', report.nombre);
    formData.append('apellidos', report.apellidos);
    formData.append('descripcion', report.descripcion);
    report.files.forEach(file => formData.append('files', file, file.name));
    
    return this.http.post<ReportDto>(this.apiUrl, formData);
  }
}
