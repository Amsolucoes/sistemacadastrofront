import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName: string | null;
  listUsers: User[] = [];
  dataSource: any;
  categorias: any[] = [];

  constructor(private usersService: UsersService) {
    this.dataSource = this.listUsers;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('user');
    this.getListUsers();
  }

  getListUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (response: any) => {
        this.categorias = [
          { titulo: 'Novo', lista: response.filter((user: User) => user.estado === 'Novo') },
          { titulo: 'Em Atendimento', lista: response.filter((user: User) => user.estado === 'Em Andamento') },
          { titulo: 'Convertido', lista: response.filter((user: User) => user.estado === 'Convertido') },
          { titulo: 'Não Convertido', lista: response.filter((user: User) => user.estado === 'Não Convertido') }
        ];
      },
      error: (err) => console.log(err)
    });
  }

  getTitulosCategorias(): string[] {
    return this.categorias.map(c => c.titulo);
  }


  moverCliente(event: CdkDragDrop<User[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Atualiza o estado do usuário ao mudar de categoria
      const usuarioMovido = event.container.data[event.currentIndex];
      usuarioMovido.estado = this.categorias.find(cat => cat.lista === event.container.data)?.titulo;
    }
  }
}
