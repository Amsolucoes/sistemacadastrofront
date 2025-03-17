import { Component, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../../interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalViewUserComponent } from './modal-view-user/modal-view-user.component';
import { ModalFormUserComponent } from './modal-form-user/modal-form-user.component';
import { ToastService } from '../../components/toast/toast.component';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent {

dataSource: any;
displayedColumns: string[] = ['name', 'email','cash', 'benefits', 'estado', 'typePlan', 'action'];
listUsers: User[] = [];

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

constructor(
  private usersService: UsersService,
  public dialog: MatDialog,
  private toast: ToastService,
) {
  this.dataSource = new MatTableDataSource<any>(this.listUsers);
}

ngOnInit() {
  this.getListUsers();
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

// Função dos usuários
getListUsers() {
  this.usersService.getAllUsers().subscribe({
    next: (response: any) => {
      this.listUsers = response;
;
      this.dataSource = new MatTableDataSource<any>(this.listUsers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = "itens por página";
    },
    error: (err) => {
      console.log(err);
    }
  });
}

deleteUser(firebaseId: string) {
  this.usersService.deleteUser(firebaseId).then(
    (response: any) => {
      this.toast.show('Cliente excluido com sucesso')
    });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

//Logicas do Modal
openModalViewUser(user: User) {
  this.dialog.open(ModalViewUserComponent, {
    width: '800px',
    height: '500px',
    data: user,
  })
}

openModalAddUser() {
  this.dialog.open(ModalFormUserComponent, {
    width: '800px',
    height: '500px',
  }).afterClosed().subscribe(() => this.getListUsers());
}

openModalEditUser(user: User) {
  this.dialog.open(ModalFormUserComponent, {
    width: '800px',
    height: '500px',
    data: user,
  }).afterClosed().subscribe(() => this.getListUsers());
}

}
