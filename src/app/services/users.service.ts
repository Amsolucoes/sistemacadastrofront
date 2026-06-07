import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Timestamp, FieldValue, serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private dataBaseStore: AngularFirestore) { }

  getAllUsers() {
    return this.dataBaseStore.collection('users', user => user.orderBy('name'))
      .valueChanges({ idField: 'firebaseId' }) as Observable<any[]>;
  }

  getUsersByMonth(year: number, month: number): Observable<User[]> {
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1);

    const startTimestamp = Timestamp.fromDate(start);
    const endTimestamp   = Timestamp.fromDate(end);

    return this.dataBaseStore.collection('users', ref =>
      ref.where('createdAt', '>=', startTimestamp)
         .where('createdAt', '<',  endTimestamp)
         .orderBy('createdAt', 'desc')
    ).valueChanges({ idField: 'firebaseId' }) as Observable<User[]>;
  }

  addUser(user: User) {
    const { firebaseId, ...userData } = user as any;
    return this.dataBaseStore.collection('users').add({
      ...userData,
      createdAt: serverTimestamp()
    });
  }

  update(userId: string, user: User) {
    return this.dataBaseStore.collection('users').doc(userId).update(user);
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
