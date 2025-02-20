import { Component } from '@angular/core';
import { User } from '../../interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName: string | null;
  listUsers: User[] = [];
  dataSource: any;

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
        this.listUsers = response;
        console.log(response);
        this.dataSource = this.listUsers;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
