import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './components/menu/menu.component';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//FireBase
import { environment } from '../environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { CrudComponent } from './pages/crud/crud.component'
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalViewUserComponent } from './pages/crud/modal-view-user/modal-view-user.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalFormUserComponent } from './pages/crud/modal-form-user/modal-form-user.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    CrudComponent,
    ModalViewUserComponent,
    ModalFormUserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // Angular Material
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
