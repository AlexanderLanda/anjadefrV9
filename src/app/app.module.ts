import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuNavBarComponent } from './visualComponents/menu-nav-bar/menu-nav-bar.component';
import { AuthService } from './Core/Service/Implements/AuthService';
import { FooterComponent } from './visualComponents/footer/footer.component';
import { RegistroComponentComponent } from './visualComponents/registro/registro.component'; // Asegúrate de ajustar la ruta
import { FormularioComponent } from './visualComponents/formulario/formulario.component';
import { ComisionesComponent } from './visualComponents/comisiones/comisiones.component';
import { LoginComponent } from './visualComponents/login/login.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { UsuariosTablaComponent } from './visualComponents/usuarios-tabla/usuarios-tabla.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportFormComponent } from './visualComponents/report-form/report-form.component';
import { ModalEditarComponent } from './visualComponents/modal-editar/modal-editar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReglamentosFileGalleryComponent } from './visualComponents/reglamentos-file-gallery/reglamentos-file-gallery.component';
import { ReportListComponent } from './visualComponents/report-list/report-list.component';
import { ReportDetailsComponent } from './visualComponents/report-details/report-details.component';
import { UserDetailsComponent } from './visualComponents/user-details/user-details.component';
import { UserCuestionarioDetailsComponent } from './visualComponents/user-cuestionario-details/user-cuestionario-details.component';
import { ReenviarPagoComponent } from './visualComponents/reenviar-pago/reenviar-pago.component';
import { SafeHtmlPipe } from './visualComponents/safe-html.pipe';



@NgModule({
  declarations: [
    AppComponent,
    MenuNavBarComponent,
    FooterComponent,
    RegistroComponentComponent,
    FormularioComponent,
     ComisionesComponent,
    LoginComponent,
    UsuariosTablaComponent,
    ReportFormComponent,
    ModalEditarComponent,
    ReglamentosFileGalleryComponent,
    ReportListComponent,
    ReportDetailsComponent,
    UserDetailsComponent,
    UserCuestionarioDetailsComponent,
    ReenviarPagoComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
