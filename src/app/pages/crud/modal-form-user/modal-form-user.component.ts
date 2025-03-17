import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../interfaces/user';
import { ToastService } from '../../../components/toast/toast.component';

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrl: './modal-form-user.component.scss'
})
export class ModalFormUserComponent {
 planosSaude = [
  {
    id: 1,
    descricao: 'Total Enfermaria'
  },
  {
    id: 2,
    descricao: 'Total Apartamento'
  },
  {
    id: 3,
    descricao: 'Parcial Enfermaria'
  },
  {
    id: 4,
    descricao: 'Parcial Apartamento'
  },
 ]

 planosOdonto = [
  {
    id: 1,
    descricao: 'Incluso'
  },
  {
    id: 2,
    descricao: 'Não Incluso'
  },
 ]

 estadoCliente = [
  {
    id: 1,
    descricao: 'Novo'
  },
  {
    id: 2,
    descricao: 'Em Atendimento'
  },
  {
    id: 3,
    descricao: 'Convertido'
  },
  {
    id: 4,
    descricao: 'Não Convertido'
  }
 ]


 formUser: FormGroup;
 editUser: boolean = false;

 constructor(
  public dialogRef: MatDialogRef<ModalFormUserComponent>,
  private formBuilder: FormBuilder,
  private usersService: UsersService,
  private toast: ToastService,
  @Inject(MAT_DIALOG_DATA) public data: any,
){}

  ngOnInit() {
    this.buildForm();
    if (this.data && this.data.name) {
      this.editUser = true;
    }
  }

  buildForm() {
    this.formUser = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      cash: [null, [Validators.required, Validators.minLength(2)]],
      phone: [null, [Validators.required, Validators.minLength(5)]],
      healthPlan: [''],
      dentalPlan: [''],
      estado: [''],
    })

    if (this.data && this.data.name) {
      this.fillForm();
    }
  }

  fillForm() {
    this.formUser.patchValue({
      name: this.data.name,
      email: this.data.email,
      cash: this.data.cash,
      phone: this.data.phone,
      healthPlan: this.data.healthPlan,
      dentalPlan: this.data.dentalPlan,
      estado: this.data.estado,
    })
  }

  saveUser() {
    const objUserForm: User = this.formUser.getRawValue();

    if (this.data && this.data.name) {
      this.usersService.update(this.data.firebaseId, objUserForm).then(
        (response: any) => {
           // Substituindo o alert pelo Toast
           this.toast.show('Cliente editado com sucesso');
           this.closeModal();
        }).catch(err => {
          // Substituindo o alert pelo Toast
          this.toast.show('Houve um erro ao editar o cliente', 'error');
          console.error(err);
        });
    } else {
      this.usersService.addUser(objUserForm).then(
        (response: any) => {
          // Substituindo o alert pelo Toast
          this.toast.show('Cliente Salvo com sucesso');
          this.closeModal();
        }).catch(err => {
          this.toast.show('Houve um erro ao salvar o cliente', 'error');
          console.error(err);
        });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
