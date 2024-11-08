import { Component, OnInit } from '@angular/core';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { Noticia } from '../../Core/Model/NoticiaDto';

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

  constructor(private noticiaService: NoticiaServiceImpl) { }

  ngOnInit() {
    this.cargarNoticias();
    
  }

  cargarNoticias() {
    this.noticiaService.obtenerNoticias(this.paginaActual, this.tamanioPagina, 'PARTICULAR').subscribe(
      response => {
        console.log(response)
        this.noticias = response.content;
        this.totalPaginas = response.totalPages;
        this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i);
      },
      error => console.error('Error al cargar noticias', error)
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
      // La URL ya es completa, así que la usamos directamente
      return noticia.imagenes[0].urlImagen;
    }
    return 'ruta/a/imagen/por/defecto.jpg'; // Ajusta esta ruta según sea necesario
  }
}