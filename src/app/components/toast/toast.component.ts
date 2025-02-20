import { Component, Injectable, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root' // Permite que seja usado globalmente
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}

@Component({
  selector: 'app-toast',
  template: '',
  styleUrls: ['./toast.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToastComponent {
  constructor() {}
}
