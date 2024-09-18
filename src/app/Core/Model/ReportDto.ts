// report.model.ts
export interface ReportDto {
    afiliacionId: string;
    nombre: string;
    apellidos: string;
    descripcion: string;
    attachments: File[];
    telefono: string;
    email: string;
  }
  