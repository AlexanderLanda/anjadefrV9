import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';

@Component({
  selector: 'app-crear-noticias',
  templateUrl: './crear-noticias.component.html',
  styleUrls: ['./crear-noticias.component.css']
})
export class CrearNoticiasComponent implements OnInit {
  noticiaForm: FormGroup;
  archivos: File[] = []; // Almacena los archivos seleccionados
  cargando = false; // Indicador de carga
  mensajeExito = ''; // Mensaje de éxito

  constructor(
    private formBuilder: FormBuilder,
    private noticiaService: NoticiaServiceImpl
  ) { }

  ngOnInit() {
    this.noticiaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      linkOriginal: ['', Validators.required],
      tipo: ['', Validators.required],
      imagenesLinks: [''] // Campo para los links de imágenes separados por comas
    });
  }
  onSubmit() {
    if (this.noticiaForm.valid) {
      this.cargando = true; // Inicia el indicador de carga
      this.mensajeExito = ''; // Limpia el mensaje de éxito previo
      const noticiaData = this.noticiaForm.value;
      const imagenesArray = noticiaData.imagenesLinks.split(',').map(link => link.trim());
      
      this.noticiaService.crearNoticia({...noticiaData, imagenes: imagenesArray}).subscribe(
        response => {
          this.cargando = false; // Finaliza el indicador de carga
          this.mensajeExito = 'Noticia insertada correctamente';
          this.noticiaForm.reset(); // Limpia el formulario
          console.log('Noticia creada', response);
          // Lógica adicional después de crear la noticia
        },
        error => {
          console.error('Error al crear la noticia', error);
          this.cargando = false;
        }
      );
    }
  }
}