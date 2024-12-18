import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comentario } from 'src/app/Core/Model/ComentarioDto';

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.css']
})
export class ComentariosModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ComentariosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comentarios: Comentario[], noticiaId: number }
  ) {}

  // Cerrar la modal
  onClose(): void {
    this.dialogRef.close();
  }
}
