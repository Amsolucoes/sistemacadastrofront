import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private usersService: UsersService, private cdRef: ChangeDetectorRef) {
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
          { titulo: 'Em Atendimento', lista: response.filter((user: User) => user.estado === 'Em Atendimento') },
          { titulo: 'Convertido', lista: response.filter((user: User) => user.estado === 'Convertido') },
          { titulo: 'Não Convertido', lista: response.filter((user: User) => user.estado === 'Não Convertido') }
        ];
      },
      error: (err) => console.log(err)
    });
  }

  getTitulosCategorias(): string[] {
    return this.categorias.map((categoria, index) => 'categoria-' + index);
  }

  // Método para detectar e atualizar as listas de categorias corretamente
  updateCategoriasLocais() {
    this.categorias = [
      { titulo: 'Novo', lista: this.categorias[0].lista },
      { titulo: 'Em Atendimento', lista: this.categorias[1].lista },
      { titulo: 'Convertido', lista: this.categorias[2].lista },
      { titulo: 'Não Convertido', lista: this.categorias[3].lista },
    ];
    this.cdRef.detectChanges();
  }

  moverCliente(event: CdkDragDrop<User[]>, categoriaDestino: any) {
    if (event.previousContainer === event.container) {
      // Movimenta dentro da mesma categoria
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const clienteMovido = event.previousContainer.data[event.previousIndex];

      // Verifica se firebaseId está definido
      if (!clienteMovido.firebaseId) {
        console.error('Erro: firebaseId indefinido para o cliente movido:', clienteMovido);
        return;
      }

      // Move o cliente de uma categoria para outra
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Atualiza o estado do cliente no Firebase Firestore
      this.usersService.updateUserState(clienteMovido.firebaseId, categoriaDestino.titulo)
        .then(() => {
          console.log(`Cliente ${clienteMovido.name} movido para ${categoriaDestino.titulo}`);
          // Após mover o cliente, atualiza as categorias localmente
          this.updateCategoriasLocais();
        })
        .catch((err) => console.error('Erro ao atualizar estado no Firebase:', err));
    }
  }
}
