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

  constructor(
    private formBuilder: FormBuilder,
    private noticiaService: NoticiaServiceImpl
  ) { }

  ngOnInit() {
    this.noticiaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      linkOriginal: ['', Validators.required],
      tipo: ['PARTICULAR', Validators.required],
    });
  }

  onFileChange(event: any) {
    this.archivos = event.target.files; // Almacena los archivos seleccionados
  }

  onSubmit() {
    if (this.noticiaForm.valid) {
      const noticiaData = this.noticiaForm.value;

      const formData: FormData = new FormData();
      formData.append('titulo', noticiaData.titulo);
      formData.append('linkOriginal', noticiaData.linkOriginal);
      formData.append('tipo', noticiaData.tipo);

      // Añade cada archivo al FormData
      for (let i = 0; i < this.archivos.length; i++) {
        formData.append('imagenes', this.archivos[i]);
      }

      // Cambia aquí para enviar el FormData en lugar de Noticia
      this.noticiaService.crearNoticia(formData).subscribe(
        response => {
          console.log('Noticia creada', response);
          alert(`Noticia agregada.`);
        },
        error => {
          console.error('Error al crear noticia', error);
        }
      );
    }
  }
}