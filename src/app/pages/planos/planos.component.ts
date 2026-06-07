import { Component, OnInit } from '@angular/core';
import { PlanosService, Plano } from '../../services/planos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss']
})
export class PlanosComponent implements OnInit {
  planos: Plano[] = [];
  novoPlano: string = '';
  editandoId: string | null = null;
  editandoNome: string = '';

  constructor(
    private planosService: PlanosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.planosService.getPlanos().subscribe(planos => {
      this.planos = planos;
    });
  }

  adicionar() {
    const nome = this.novoPlano.trim();
    if (!nome) return;

    this.planosService.addPlano(nome).then(() => {
      this.snackBar.open('Plano adicionado!', 'Fechar', { duration: 3000 });
      this.novoPlano = '';
    }).catch(() => {
      this.snackBar.open('Erro ao adicionar plano.', 'Fechar', { duration: 3000 });
    });
  }

  iniciarEdicao(plano: Plano) {
    this.editandoId = plano.firebaseId!;
    this.editandoNome = plano.nome;
  }

  salvarEdicao() {
    if (!this.editandoId || !this.editandoNome.trim()) return;

    this.planosService.updatePlano(this.editandoId, this.editandoNome.trim()).then(() => {
      this.snackBar.open('Plano atualizado!', 'Fechar', { duration: 3000 });
      this.editandoId = null;
      this.editandoNome = '';
    });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.editandoNome = '';
  }

  excluir(id: string) {
    if (!confirm('Excluir este plano?')) return;
    this.planosService.deletePlano(id).then(() => {
      this.snackBar.open('Plano excluído!', 'Fechar', { duration: 3000 });
    });
  }
}
