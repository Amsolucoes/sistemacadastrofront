import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private usersService: UsersService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) {
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
          { titulo: 'Não Convertido', lista: response.filter((user: User) => user.estado === 'Não Convertido') },
          { titulo: 'Finalizado', lista: response.filter((user: User) => user.estado === 'Finalizado') }
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
      { titulo: 'Finalizado', lista: this.categorias[4].lista },
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

  atualizarComentario(cliente: User, event: Event) {
    if (!cliente.firebaseId) {
      console.error('Erro: firebaseId indefinido para o cliente:', cliente);
      return;
    }

    const comentarioSeguro: string = cliente.comentario ?? ''; // Garante que o comentário será sempre uma string
    const firebaseIdSeguro: string = cliente.firebaseId as string;

    // Se o cliente não tiver uma contagem, inicializa
    if (cliente.tempoRestante === undefined) {
      cliente.tempoRestante = 5; // 5 segundos
      cliente.tempoMensagem = `Aguarde... tempo restante: ${cliente.tempoRestante}s`; // Inicializa a mensagem de tempo
    }

    // Evitar mostrar o toast toda vez que o usuário digita
    if (!cliente.toastExibido) {
      // Exibe o Toast apenas uma vez quando o usuário começar a escrever
      this.snackBar.open('Comentário sendo atualizado...', 'Fechar', {
        duration: 5000, // Toast vai durar 5 segundos
      });

      cliente.toastExibido = true; // Marca que o toast já foi exibido
    }

    // Limpa qualquer intervalo existente antes de iniciar um novo
    if (cliente.intervalo) {
      clearInterval(cliente.intervalo); // Limpar o intervalo anterior se existir
    }

    // Contagem regressiva de 30 segundos para esse cliente
    cliente.intervalo = setInterval(() => {
      if (cliente.tempoRestante && cliente.tempoRestante > 0) {
        cliente.tempoRestante--;
        cliente.tempoMensagem = `Aguarde... tempo restante: ${cliente.tempoRestante}s`;

        if (cliente.tempoRestante === 0) {
          clearInterval(cliente.intervalo); // Limpar intervalo após 30 segundos
          this.snackBar.open('Comentário atualizado!', 'Fechar', {
            duration: 5000, // Toast vai durar 5 segundos
          });

          // Atualiza o comentário após o tempo expirar
          console.log('Tempo esgotado, salvando comentário:', comentarioSeguro); // Verifique se o comentário está correto
          this.usersService.updateUserComentario(firebaseIdSeguro, comentarioSeguro)
            .then(() => {
              console.log(`Comentário atualizado para ${cliente.name}`);
              console.log(`Comentário salvo: ${comentarioSeguro}`); // Verifique o comentário salvo
            })
            .catch((err) => console.error('Erro ao atualizar comentário:', err));
        }
      }
    }, 1000); // 1000ms = 1 segundo
  }

  deletar(cliente: User) {
    if (!cliente.firebaseId) {
      console.error('Erro: firebaseId indefinido para o cliente:', cliente);
      return; // Sai da função se firebaseId não for válido
    }

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      // Chama o método de exclusão no serviço para excluir o cliente
      this.usersService.deleteUser(cliente.firebaseId)
        .then(() => {
          console.log(`Cliente ${cliente.name} excluído com sucesso.`);
          // Atualiza a lista de usuários ou realiza alguma ação após exclusão
          this.getListUsers(); // Refaz a listagem dos clientes
        })
        .catch((err) => {
          console.error('Erro ao excluir cliente:', err);
        });
    }
  }



}
