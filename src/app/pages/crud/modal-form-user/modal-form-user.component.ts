import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrl: './modal-form-user.component.scss'
})
export class ModalFormUserComponent {
 planosSaude = [
  {
    id: 1,
    descricao: 'Plano 300 enfermaria'
  },
  {
    id: 2,
    descricao: 'Plano 400 enfermaria'
  },
  {
    id: 3,
    descricao: 'Plano 500 plus'
  },
 ]

 planosOdonto = [
  {
    id: 1,
    descricao: 'Plano Basic'
  },
  {
    id: 2,
    descricao: 'Plano Medium'
  },
  {
    id: 3,
    descricao: 'Plano plus'
  },
 ]


 formUser: FormGroup;
 editUser: boolean = false;

 constructor(
  public dialogRef: MatDialogRef<ModalFormUserComponent>,
  private formBuilder: FormBuilder,
  private usersService: UsersService,
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
      sector: [null, [Validators.required, Validators.minLength(2)]],
      role: [null, [Validators.required, Validators.minLength(5)]],
      helthPlan: [''],
      dentalPlan: [''],
    })

    if (this.data && this.data.name) {
      this.fillForm();
    }
  }

  fillForm() {
    this.formUser.patchValue({
      name: this.data.name,
      email: this.data.email,
      sector: this.data.sector,
      role: this.data.role,
      helthPlan: this.data.helthPlan,
      dentalPlan: this.data.dentalPlan
    })
  }

  saveUser() {
    const objUserForm: User = this.formUser.getRawValue();

    if (this.data && this.data.name) {
      this.usersService.update(this.data.firebaseId, objUserForm).then(
        (response: any) => {
          window.alert('Usuário editado com sucesso');
          this.closeModal();
        }).catch(err => {
          window.alert('Houve um erro ao editar o usuário')
          console.error(err);
        });
    } else {
      this.usersService.addUser(objUserForm).then(
        (response: any) => {
          window.alert('Usuário Salvo com sucesso');
          this.closeModal();
        }).catch(err => {
          window.alert('Houve um erro ao salvar o usuário')
          console.error(err);
        });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
