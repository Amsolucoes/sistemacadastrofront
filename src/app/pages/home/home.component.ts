import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { PlanosService, Plano } from '../../services/planos.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName: string | null;
  userPhoto: string = '';
  localizacao: string = 'Buscando localização...';
  categorias: any[] = [];
  todosClientes: User[] = [];

  selectedMonth: number;
  selectedYear: number;
  selectedPlano: string = '';
  planos: Plano[] = [];

  months = [
    { value: 1,  label: 'Janeiro' },
    { value: 2,  label: 'Fevereiro' },
    { value: 3,  label: 'Março' },
    { value: 4,  label: 'Abril' },
    { value: 5,  label: 'Maio' },
    { value: 6,  label: 'Junho' },
    { value: 7,  label: 'Julho' },
    { value: 8,  label: 'Agosto' },
    { value: 9,  label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];
  years: number[] = [];

  constructor(
    private usersService: UsersService,
    private planosService: PlanosService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userName = sessionStorage.getItem('user');
    this.userPhoto = sessionStorage.getItem('userPhoto') || '';

    const hoje = new Date();
    this.selectedMonth = hoje.getMonth() + 1;
    this.selectedYear  = hoje.getFullYear();

    for (let y = hoje.getFullYear() - 2; y <= hoje.getFullYear(); y++) {
      this.years.push(y);
    }

    this.planosService.getPlanos().subscribe(planos => {
      this.planos = planos;
    });

    this.getListUsers();
    this.obterLocalizacao();
  }

  atualizarFoto() {
    const url = prompt('Cole a URL da sua foto de perfil:');
    if (url && url.trim()) {
      this.userPhoto = url.trim();
      sessionStorage.setItem('userPhoto', this.userPhoto);
    }
  }

  obterLocalizacao() {
    if (!navigator.geolocation) {
      this.localizacao = 'Localização não disponível';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
          );
          const data = await response.json();
          const cidade = data.address?.city
                      || data.address?.town
                      || data.address?.village
                      || data.address?.county
                      || '';
          const estado = data.address?.state_code || data.address?.state || '';
          this.localizacao = cidade && estado ? `${estado} - ${cidade}` : 'Localização encontrada';
        } catch {
          this.localizacao = 'Erro ao obter cidade';
        }
        this.cdRef.detectChanges();
      },
      () => {
        this.localizacao = 'Permissão negada';
        this.cdRef.detectChanges();
      }
    );
  }

  onMonthYearChange() {
    this.getListUsers();
  }

  onPlanoChange() {
    this.aplicarFiltros();
  }

  getListUsers() {
    this.usersService.getUsersByMonth(this.selectedYear, this.selectedMonth).subscribe({
      next: (response: User[]) => {
        this.todosClientes = response;
        this.aplicarFiltros();
      },
      error: (err) => console.error(err)
    });
  }

  aplicarFiltros() {
    const filtrados = this.selectedPlano
      ? this.todosClientes.filter(u => u.healthPlan === this.selectedPlano)
      : this.todosClientes;

    this.categorias = [
      { titulo: 'Novo',           lista: filtrados.filter(u => u.estado === 'Novo') },
      { titulo: 'Em Atendimento', lista: filtrados.filter(u => u.estado === 'Em Atendimento') },
      { titulo: 'Convertido',     lista: filtrados.filter(u => u.estado === 'Convertido') },
      { titulo: 'Não Convertido', lista: filtrados.filter(u => u.estado === 'Não Convertido') },
      { titulo: 'Finalizado',     lista: filtrados.filter(u => u.estado === 'Finalizado') },
    ];
  }

  getTitulosCategorias(): string[] {
    return this.categorias.map((_, index) => 'categoria-' + index);
  }

  updateCategoriasLocais() {
    this.categorias = [...this.categorias];
    this.cdRef.detectChanges();
  }

  moverCliente(event: CdkDragDrop<User[]>, categoriaDestino: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const clienteMovido = event.previousContainer.data[event.previousIndex];

      if (!clienteMovido.firebaseId) return;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.usersService.updateUserState(clienteMovido.firebaseId, categoriaDestino.titulo)
        .then(() => this.updateCategoriasLocais())
        .catch(err => console.error(err));
    }
  }

  atualizarComentario(cliente: User, event: Event) {
    if (!cliente.firebaseId) return;

    const comentarioSeguro = cliente.comentario ?? '';
    const firebaseIdSeguro = cliente.firebaseId as string;

    if (!(cliente as any).toastExibido) {
      this.snackBar.open('Comentário sendo atualizado...', 'Fechar', { duration: 5000 });
      (cliente as any).toastExibido = true;
    }

    if ((cliente as any).intervalo) clearInterval((cliente as any).intervalo);

    (cliente as any).tempoRestante = 5;
    (cliente as any).intervalo = setInterval(() => {
      (cliente as any).tempoRestante--;
      if ((cliente as any).tempoRestante === 0) {
        clearInterval((cliente as any).intervalo);
        this.snackBar.open('Comentário atualizado!', 'Fechar', { duration: 3000 });
        this.usersService.updateUserComentario(firebaseIdSeguro, comentarioSeguro)
          .then(() => (cliente as any).toastExibido = false)
          .catch(err => console.error(err));
      }
    }, 1000);
  }

  deletar(cliente: User) {
    if (!cliente.firebaseId) return;
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.usersService.deleteUser(cliente.firebaseId)
        .catch(err => console.error(err));
    }
  }
}
