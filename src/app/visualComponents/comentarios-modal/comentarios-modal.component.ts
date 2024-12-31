import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comentario } from 'src/app/Core/Model/ComentarioDto';
import { Noticia } from 'src/app/Core/Model/NoticiaDto';
import { AuthService } from 'src/app/Core/Service/Implements/AuthService';
import { NoticiaServiceImpl } from 'src/app/Core/Service/Implements/NoticiaServiceImpl';
import { UsuariosServiceImpl } from 'src/app/Core/Service/Implements/UsuariosServiceImpl';

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.css']
})
export class ComentariosModalComponent implements OnInit {
  comentariosConNombres: Comentario[] = [];
  comentarioTexto: string = '';
  idAfiliacion: string = ''; // Para el idAfiliacion si no está logueado
  isUserLoggedIn: boolean = false; // Determina si el usuario está logueado
  crearComentario: boolean = false;
  isSendingComment: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ComentariosModalComponent>,private dialog: MatDialog,private noticiaService: NoticiaServiceImpl,private authService: AuthService ,private usuariosService: UsuariosServiceImpl,
    @Inject(MAT_DIALOG_DATA) public data: { comentarios: Comentario[], noticiaId: number }
  ) {}

  ngOnInit() {

    this.isUserLoggedIn = this.authService.isUserLoggedIn();

    // Si está logueado, obtenemos el idAfiliacion del usuario
    if (this.isUserLoggedIn) {
      this.idAfiliacion = this.authService.getIdAfiliacion(); // Obtener idAfiliacion desde el servicio
      console.log(this.idAfiliacion)
    }
    // Crea los observables para cada comentario
    const observables = this.data.comentarios.map(comentario =>
      this.usuariosService.getNameUserById(comentario.idAfiliacion).pipe(
        map(nombre => ({ ...comentario, nombre })) // Agrega el nombre al comentario
      )
    );

    // Espera a que todos los observables se resuelvan
    forkJoin(observables).subscribe(comentariosConNombres => {
      this.comentariosConNombres = comentariosConNombres; // Asigna los comentarios con nombres
      console.log("comentarios con nombres"+this.comentariosConNombres); // Verifica los resultados
    });
    console.log(this.data.comentarios)
  }

  // Cerrar la modal
  onClose(): void {
    this.dialogRef.close();
  }


  toggleComentarioForm() {
    //noticia.mostrarFormulario = !noticia.mostrarFormulario;
  
  this.crearComentario = true;

  }

  agregarComentario(idNoticia: number) {
    // Validar que el comentario no está vacío y el idAfiliacion esté presente si el usuario no está logueado
    if (!this.comentarioTexto || (this.comentarioTexto.trim() === '')) {
      alert("El comentario es obligatorio.");
      return;
    }

    if (!this.isUserLoggedIn && (!this.idAfiliacion || this.idAfiliacion.trim() === '')) {
      alert("El idAfiliacion es obligatorio.");
      return;
    }

    // Establece el estado del spinner
    this.isSendingComment = true;
    const comentario: Comentario = {
      texto: this.comentarioTexto,
      idAfiliacion: this.isUserLoggedIn ? this.idAfiliacion : this.idAfiliacion
    };
    this.crearComentario = false;
    console.log("NOTICIA ID: "+idNoticia)
    // Llamar al servicio para agregar el comentario
    this.noticiaService.agregarComentario(idNoticia, comentario).subscribe(
      response => {
        this.isSendingComment = false;  // Finaliza el estado del spinner
        console.log('Comentario agregado:', response);
        this.data.comentarios.push(response);
        this.comentarioTexto = ''; // Limpiar el comentario después de agregarlo
        this.idAfiliacion = ''; // Limpiar idAfiliacion si es necesario
        // Cerrar la modal actual
      this.dialogRef.close();

      // Opcionalmente, puedes abrir la modal nuevamente para reflejar los cambios
      this.dialog.open(ComentariosModalComponent, {
        data: {
          // Pasar los datos actualizados (por ejemplo, la noticia actualizada)
          comentarios: this.data.comentarios,
          noticiaId: this.data.noticiaId,
        }
      });
      },
      error => {
        console.error('Error al agregar comentario', error);
        this.isSendingComment = false;  // Finaliza el estado del spinner
      }
    );
  }
}
