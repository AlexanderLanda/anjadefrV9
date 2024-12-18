import { Component, OnInit } from '@angular/core';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { ActivatedRoute } from '@angular/router';
import { Comentario } from 'src/app/Core/Model/ComentarioDto';
import { AuthService } from 'src/app/Core/Service/Implements/AuthService';
import { MatDialog } from '@angular/material/dialog';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';

@Component({
  selector: 'app-noticias-anjade',
  templateUrl: './noticias-anjade.component.html',
  styleUrls: ['./noticias-anjade.component.css']
})
export class NoticiasAnjadeComponent implements OnInit {
  noticias: Noticia[] = [];
  paginaActual = 0;
  tamanioPagina = 10;
  totalPaginas = 0;
  paginas: number[] = [];
  tipoNoticia: string = '';

  usuarioLogueado: boolean = false; // Simula el estado del usuario logueado
  nuevoComentario: Comentario = { texto: '', idAfiliacion: '' }; // Modelo básico para comentarios
  comentarios: { [key: number]: Comentario[] } = {}; // Comentarios por noticia
  comentarioTexto: string = '';
  idAfiliacion: string = ''; // Para el idAfiliacion si no está logueado
  isUserLoggedIn: boolean = false; // Determina si el usuario está logueado


  constructor(private noticiaService: NoticiaServiceImpl, private route: ActivatedRoute,
    private authService: AuthService ,private dialog: MatDialog) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.tipoNoticia = data['tipoNoticia'] || '';
      this.cargarNoticias();
    });
    this.isUserLoggedIn = this.authService.isUserLoggedIn();

    // Si está logueado, obtenemos el idAfiliacion del usuario
    if (this.isUserLoggedIn) {
      this.idAfiliacion = this.authService.getIdAfiliacion(); // Obtener idAfiliacion desde el servicio
      console.log(this.idAfiliacion)
    }
    console.log(this.tipoNoticia)
  }

  cargarNoticias() {
    this.noticiaService.obtenerNoticias(this.paginaActual, this.tamanioPagina, this.tipoNoticia)
      .subscribe(
        (response: any) => {
          this.noticias = response.content;
          console.log(this.noticias)
          // Aquí puedes manejar la paginación si es necesario
        },
        error => {
          console.error('Error al cargar noticias', error);
        }
      );
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarNoticias();
    }
  }

  getImageUrl(noticia: any): string {
    if (noticia.imagenes && noticia.imagenes.length > 0 && noticia.imagenes[0].urlImagen) {
      const imagen = noticia.imagenes[0];
      if (imagen.urlImagen) {
        // Intenta primero con la URL original
        return imagen.urlImagen;
      } else if (imagen.name) {
        // Si no hay URL original o falla, usa la imagen local
        return `assets/imagen/noticias/${imagen.name}`;
      }
    }
    // Si no hay imágenes, usa una imagen por defecto
    return 'assets/imagen/noticias/' + noticia.imagenes[0].name + '.jpg';
  }

  handleImageError(noticia: any) {
    if (noticia.imagenes && noticia.imagenes.length > 0) {
      const imagen = noticia.imagenes[0];
      if (imagen.urlImagen) {
        // Si la imagen original falla, intenta con la local
        console.log(`La imagen ${imagen.urlImagen} no se pudo cargar. Intentando con la imagen local.`);
        imagen.urlImagen = null;
        // Esto forzará a getImageUrl a usar el nombre local en el próximo intento
      }
    }
  }

  mostrarComentarios(noticia: Noticia): void {
    this.noticiaService.obtenerComentarios(noticia.id).subscribe(comentarios => {
      if (comentarios.length > 0) {
        // Abrir la modal con los comentarios
        this.dialog.open(ComentariosModalComponent, {
          data: { comentarios: comentarios, noticiaId: noticia.id }
        });
      } else {
        // Mostrar mensaje de que no hay comentarios
        alert('No hay comentarios para esta publicación.');
      }
    });
  }

  toggleComentarioForm(noticia: Noticia) {
    noticia.mostrarFormulario = !noticia.mostrarFormulario;
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

    const comentario: Comentario = {
      texto: this.comentarioTexto,
      idAfiliacion: this.isUserLoggedIn ? this.idAfiliacion : this.idAfiliacion
    };
 
    console.log("NOTICIA ID: "+idNoticia)
    // Llamar al servicio para agregar el comentario
    this.noticiaService.agregarComentario(idNoticia, comentario).subscribe(
      response => {
        console.log('Comentario agregado:', response);
        this.comentarioTexto = ''; // Limpiar el comentario después de agregarlo
        this.idAfiliacion = ''; // Limpiar idAfiliacion si es necesario
      },
      error => {
        console.error('Error al agregar comentario', error);
      }
    );
  }
}