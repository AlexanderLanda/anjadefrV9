import { Component, OnInit } from '@angular/core';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private noticiaService: NoticiaServiceImpl,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.tipoNoticia = data['tipoNoticia'] || '';
      this.cargarNoticias();
    });
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
    return 'assets/imagen/noticias/'+noticia.imagenes[0].name+'.jpg';
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