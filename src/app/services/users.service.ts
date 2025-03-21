import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private dataBaseStore: AngularFirestore) { }

  getAllUsers() {
    return this.dataBaseStore.collection('users', user => user.orderBy('name'))
    .valueChanges({idField: 'firebaseId'}) as Observable<any[]>;
  }

  addUser(user: User) {
    return this.dataBaseStore.collection('users').add(user);
  }

  update(userId: string, user: User) {
    return this.dataBaseStore.collection('users').doc(userId).update(user)
  }

  updateUserState(firebaseId: string, novoEstado: string) {
    return this.dataBaseStore.collection('users').doc(firebaseId).update({ estado: novoEstado });
  }

  updateUserComentario(firebaseId: string, comentario: string): Promise<void> {
    return this.dataBaseStore.collection('users').doc(firebaseId).update({ comentario });
  }

  deleteUser(userId: string) {
    return this.dataBaseStore.collection('users').doc(userId).delete();
  }
}
