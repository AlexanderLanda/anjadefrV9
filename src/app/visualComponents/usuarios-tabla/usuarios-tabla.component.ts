import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UsuariosDto } from '../../Core/Model/UsuariosDto';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { AfiliadosFuncionDto } from '../../Core/Model/AfiliadosFuncionDto';
import { AfiliadosFuncionServiceImpl } from '../../Core/Service/Implements/AfiliadosFuncionServiceImpl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../Core/Service/Implements/DataService';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

import * as GENERIC_CONST from '../../constants/genericconstant';
import { AuthService } from 'src/app/Core/Service/Implements/AuthService';




/**
 * @title Table with pagination
 */

@Component({
  selector: 'app-usuarios-tabla',
  templateUrl: './usuarios-tabla.component.html',
  styleUrls: ['./usuarios-tabla.component.css']
})
export  class UsuariosTablaComponent implements AfterViewInit {



  displayedColumns: string[] = ['idAfiliacion', 'apellidos', 'nombre', 'funcion', 'estadoFuncion', 'categoria', 'deporte', 'provincia', 'estado', 'rolAfiliado', 'editar'];
  listadoUsuarios: UsuariosDto[] | undefined;
  listadoUsuariosFiltrados: UsuariosDto[] | undefined;
  dataSource: MatTableDataSource<UsuariosDto>;
  userlogin : UsuariosDto| undefined;
  selectedFuncion: number | undefined;
  afiliadosFunciones: AfiliadosFuncionDto[] | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(
    private usuariosService: UsuariosServiceImpl,
    private _liveAnnouncer: LiveAnnouncer,
    private afiliadosFuncionService: AfiliadosFuncionServiceImpl,
    private dialog: MatDialog,
    private dataService: DataService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource<UsuariosDto>([]);
  }

  ngOnInit() {
    this.userlogin = this.authService.getCurrentUser();
    this.dataService.data$.subscribe(updated => {
      if (updated) {
        this.cargarListadoDeUsuarios();
      }
    });
    this.cargarListadoDeUsuarios();
    this.cargarFuncionesDeAfiliadosComboBox();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPaginatedData(): any[] {
    const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    const endIndex = startIndex + (this.paginator ? this.paginator.pageSize : 10);
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  editarFila(element: any): void {
    /*
    const dialogRef = this.dialog.open(ModalEditarComponent, {
      data: { fila: element }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrada');
    });
*/
    const modalRef = this.modalService.open(ModalEditarComponent);
		modalRef.componentInstance.data =  element;
	}
  

  
  filtrar(event : Event){
    const filtro = (event?.target as HTMLInputElement).value;
    console.log(event);
    this.dataSource.filter = filtro.trim().toLowerCase()  ; 
  }

  getEstadoCuentaClass(estado: number): string {
    if (estado === 3) {
      return 'table-danger'; // Si el estado es 1, devuelve la clase 'estado-rojo'
    } else if (estado === 4) {
      return 'table-warning'; // Si el estado es 2, devuelve la clase 'estado-amarillo'
    } else {
      return ''; // Si el estado no es 1 ni 2, no se aplica ninguna clase adicional
    }
  }

  cargarListadoDeUsuarios(){

    this.usuariosService.getUsuarios().subscribe(usuarios => {
      this.listadoUsuarios = usuarios.filter(usuario => usuario.estadoCuenta.id !== GENERIC_CONST.ESTADO_USUARIO_DENEGADO && usuario.usuariorol.id !==GENERIC_CONST.USER_ADMIN_ROL);
      this.dataSource.data = this.listadoUsuarios;
      this.dataSource.paginator = this.paginator; // Asegúrate de actualizar el paginador después de cargar los datos
      this.dataSource.sort = this.sort; // Asegúrate de actualizar el ordenamiento después de cargar los datos
      console.log(this.listadoUsuarios);
    });
      
  }

  

  cargarFuncionesDeAfiliadosComboBox() {

    this.afiliadosFuncionService.getAfiliadosFuncion().subscribe(afiliadosRoles => {
      this.afiliadosFunciones = afiliadosRoles;
    })
  }
  

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  customFilterPredicate(data: UsuariosDto, filter: string): boolean {
    const flatData = this.flattenObject(data);
    const dataStr = Object.values(flatData).join(' ').toLowerCase();
    return dataStr.includes(filter);
  }

  flattenObject(obj: any): any {
    const result: any = {};
    
    function recurse(cur: any, prop: string) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (let i = 0; i < cur.length; i++) {
          recurse(cur[i], prop ? `${prop}[${i}]` : `${i}`);
        }
        if (cur.length === 0) {
          result[prop] = [];
        }
      } else {
        let isEmpty = true;
        for (const p in cur) {
          if (cur.hasOwnProperty(p)) {
            isEmpty = false;
            recurse(cur[p], prop ? `${prop}.${p}` : p);
          }
        }
        if (isEmpty && prop) {
          result[prop] = {};
        }
      }
    }

    recurse(obj, "");
    return result;
  }
  downloadExcel() {
    if (!this.listadoUsuarios || this.listadoUsuarios.length === 0) {
      console.error('No hay datos para exportar');
      return;
    }

    const data = this.listadoUsuarios
      .filter(user => user.usuariorol?.descripcion !== 'administrador')
      .map(user => ({
        Nombre: user.nombre,
        Apellidos: user.apellidos,
        'Fecha de Nacimiento': user.fechaNacimiento,
        Dirección: user.direccion,
        Correo: user.correo,
        Deporte: user.deporte?.nombre || '',
        Localidad: user.localidad|| '',
        Provincia: user.provincia?.descripcion || '',
        'Tipo de Documento': user.tipoDocumento?.descripcion || '',
        Documento: user.documento,
        'C.P': user.codigoPostal,
        Teléfono: user.telefono,
        'Función': user.afiliadosFuncion?.descripcion || '',
        'Categoría': user.afiliadosCategoria?.descripcion || '',
        'Rol de Usuario': user.usuariorol?.descripcion || '',
        'Fecha de Afiliación': user.fechaAfiliacion,
        'Situación Actual': user.situacionActual,
        'Pago': user.tipoPago?.descripcion || '',
        'ID de Afiliación': user.idAfiliacion
      }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Estilo para el encabezado
    const headerStyle = {
      fill: { fgColor: { rgb: "90EE90" } }, // Color verde claro
      font: { bold: true },
      alignment: { horizontal: "center" }
    };

    // Aplicar estilo al encabezado
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = headerStyle;
    }

    // Ajustar el ancho de las columnas
    const columnsWidth = data.reduce((width, row) => {
      Object.keys(row).forEach((key, i) => {
        const cellLength = row[key] ? row[key].toString().length : 10;
        width[i] = Math.max(width[i] || 0, cellLength);
      });
      return width;
    }, []);

    worksheet['!cols'] = columnsWidth.map(w => ({ width: w + 2 })); // +2 para un poco de padding

    const workbook: XLSX.WorkBook = { Sheets: { 'Usuarios': worksheet }, SheetNames: ['Usuarios'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Listado_Usuarios.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  }

}
