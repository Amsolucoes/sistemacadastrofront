import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  passwordVisible: boolean = false; // Controla a visibilidade da senha


  constructor(private route: Router, private authService: AuthService) {

  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    this.authService.login(this.email, this.password)
      .then(() => {
        this.route.navigate(['home']);
      })
      .catch(error => {
        this.errorMessage = 'Erro ao fazer login: ' + (error.message || 'Usuário ou senha incorretos!');
        console.error(error);
      });
  }

  // Função para alternar a visibilidade da senha
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

}
