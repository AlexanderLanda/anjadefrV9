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
      console.log('Datos de ruta:', data); // Para depuración
      this.tipoNoticia = data['tipoNoticia'] || '';
      console.log('Tipo de noticia:', this.tipoNoticia); // Para depuración
      this.cargarNoticias();
    });
    console.log(this.tipoNoticia)
  }

  cargarNoticias() {
    this.noticiaService.obtenerNoticias(this.paginaActual, this.tamanioPagina, this.tipoNoticia)
      .subscribe(
        (response: any) => {
          this.noticias = response.content;
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
      // La URL ya es completa, así que la usamos directamente
      return noticia.imagenes[0].urlImagen;
    }
    return 'ruta/a/imagen/por/defecto.jpg'; // Ajusta esta ruta según sea necesario
  }
}