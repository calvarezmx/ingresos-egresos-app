import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import * as firebase from 'firebase';

import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth, 
    private router: Router,
    private afDB: AngularFirestore ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      console.log('fbUser: ', fbUser);
    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then( res => {
      console.log('success: ', res);

      const user: User = {
        nombre: nombre,
        uid: res.user.uid,
        email: res.user.email
      };

      this.afDB.doc(` ${ user.uid }/usuario `).set( user )
      .then( res => {
        console.log('success: ', res);
          this.router.navigate(['/']);
      }).catch( err => {
          console.log('err: ', err);
      });

    }).catch( err => {
      console.log('error: ', err);
      Swal.fire('Error en el login', err.message, 'error');
    });
  }

  loginUser( email: string, password: string ) {
    this.afAuth.auth.signInWithEmailAndPassword( email, password)
    .then( res => {
      console.log('success: ', res);
      this.router.navigate(['/']);
    }).catch( err => {
      console.log('error: ', err);
      Swal.fire('Error en el login', err.message, 'error');
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map( fbUser => {
        if ( fbUser == null ) {
          this.router.navigate(['/login']);
        }
        return fbUser != null ;
      })
    );
  }
}
