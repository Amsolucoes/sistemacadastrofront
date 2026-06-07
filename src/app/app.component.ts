import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'crud-usuarios';
  loading = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Loading inicial ao abrir o sistema
    setTimeout(() => {
      this.loading = false;
    }, 1800);

    // Loading a cada navegação entre rotas
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.loading = false, 400);
      }
    });
  }
}
