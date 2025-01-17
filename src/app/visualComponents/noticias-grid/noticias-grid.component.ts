import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Noticia } from 'src/app/Core/Model/NoticiaDto';
import { AuthService } from 'src/app/Core/Service/Implements/AuthService';
import { NoticiaServiceImpl } from 'src/app/Core/Service/Implements/NoticiaServiceImpl';

@Component({
  selector: 'app-noticias-grid',
  templateUrl: './noticias-grid.component.html',
  styleUrls: ['./noticias-grid.component.css']
})
export class NoticiasGridComponent implements OnInit {

  noticias: Noticia[] = [];
  paginaActual: number = 0;
  noticiasPorPagina: number = 9;
  totalPaginas: number = 0;
  noticiasPaginadas: Noticia[] = [];
  tipoNoticia: string = '';
  paginas: number[] = [];

   constructor(private noticiaService: NoticiaServiceImpl, private route: ActivatedRoute,
      private authService: AuthService ,private dialog: MatDialog) { }
      
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.tipoNoticia = data['tipoNoticia'] || '';
      this.cargarNoticias();
    });
    this.ordenarNoticiasPorFecha();
    this.calcularPaginacion();
  }

  cargarNoticias() {
    this.noticiaService.obtenerNoticias(this.paginaActual, this.noticiasPorPagina, this.tipoNoticia)
      .subscribe(
        (response: any) => {
          this.noticias = response.content;
          console.log(this.noticias)
          this.noticiasPaginadas = this.noticias.slice(0, 8);
          // Aquí puedes manejar la paginación si es necesario
        },
        error => {
          console.error('Error al cargar noticias', error);
        }
      );
  }

  ordenarNoticiasPorFecha(): void {
    this.noticias.sort((a, b) => new Date(b.fechaInsercion).getTime() - new Date(a.fechaInsercion).getTime());
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.noticias.length / this.noticiasPorPagina);
    this.cambiarPagina(0);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas) return;

    this.paginaActual = pagina;
    const inicio = pagina * this.noticiasPorPagina;
    const fin = inicio + this.noticiasPorPagina;
    this.noticiasPaginadas = this.noticias.slice(inicio, fin);
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

}
