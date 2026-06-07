import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Plano {
  firebaseId?: string;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanosService {

  constructor(private firestore: AngularFirestore) {}

  getPlanos(): Observable<Plano[]> {
    return this.firestore.collection<Plano>('planos', ref => ref.orderBy('nome'))
      .valueChanges({ idField: 'firebaseId' });
  }

  addPlano(nome: string) {
    return this.firestore.collection('planos').add({ nome });
  }

  updatePlano(id: string, nome: string) {
    return this.firestore.collection('planos').doc(id).update({ nome });
  }

  deletePlano(id: string) {
    return this.firestore.collection('planos').doc(id).delete();
  }
}
