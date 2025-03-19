import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  // 🔹 Função para registrar o usuário e salvar no Firestore
  // async register(email: string, password: string, name: string) {
  //   try {
  //     const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
  //     const uid = userCredential.user?.uid;

  //     if (uid) {
  //       // 🔹 Salvar usuário autenticado na coleção authUsers
  //       await this.db.collection('authUsers').doc(uid).set({
  //         uid,
  //         email,
  //         name,
  //         createdAt: new Date()
  //       });
  //     }

  //     return userCredential;
  //   } catch (error) {
  //     console.error('Erro ao registrar:', error);
  //     throw error;
  //   }
  // }

  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Verificar se o usuário já existe na coleção authUsers
        const userDoc = await this.db.collection('authUsers').doc(uid).get().toPromise();

        if (userDoc && !userDoc.exists) {
          // 🔹 Salvar usuário autenticado na coleção authUsers
          await this.db.collection('authUsers').doc(uid).set({
            uid,
            email,
            name,
            createdAt: new Date()
          });
        }
      }

      return userCredential;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }

  // 🔹 Função para login
  // async login(email: string, password: string) {
  //   return this.afAuth.signInWithEmailAndPassword(email, password);
  // }

    // 🔹 Função para login
    async login(email: string, password: string) {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const uid = userCredential.user?.uid;

        if (uid) {
          // Verificar se o documento já existe na coleção authUsers
          const userDoc = await this.db.collection('authUsers').doc(uid).get().toPromise();

          if (userDoc && !userDoc.exists) {
            // Se não existir, cria o documento em authUsers com dados adicionais do usuário
            const userData = await this.db.collection('users').doc(uid).get().toPromise();

            // Verificar se os dados do usuário existem antes de usá-los
            if (userData && userData.exists) {
              const user = userData.data() as User;
              await this.db.collection('authUsers').doc(uid).set({
                uid,
                email,
                name: user.name, // Dados adicionais do usuário, como nome
                createdAt: new Date()
              });
            } else {
              console.error('Dados do usuário não encontrados!');
            }
          }
        }

        return userCredential;
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
      }
    }

  // 🔹 Logout
  async logout() {
    return this.afAuth.signOut();
  }

  // 🔹 Pegar usuário autenticado
  getUser() {
    return this.afAuth.authState;
  }
}
