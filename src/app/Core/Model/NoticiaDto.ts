export interface Noticia {
    id?: number;
    titulo: string;
    linkOriginal: string;
    imagenes: any[];
    fechaInsercion?: Date;
    tipo: 'PARTICULAR' | 'GENERAL';
  }