import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import * as firebase from 'firebase';

import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor( private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState> ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      console.log('fbUser: ', fbUser);
      if ( fbUser ) {
        this.userSubscription = this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges()
        .subscribe( (userFB: any) => {
          const usuario = new User( userFB );
          this.store.dispatch(new SetUserAction( usuario));
          console.log('usuarioObj: ', usuario);
          this.usuario = usuario;
        });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    this.store.dispatch( new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then( res => {
      console.log('success crearUsuario: ', res);

      const user: User = {
        nombre: nombre,
        uid: res.user.uid,
        email: res.user.email
      };

      this.afDB.doc(`${ user.uid }/usuario`).set( user )
      // tslint:disable-next-line:no-shadowed-variable
      .then( res => {
        console.log('success: ', res);
          this.router.navigate(['/']);
          this.store.dispatch( new DesactivarLoadingAction());
      }).catch( err => {
          console.log('err crearUsuario: ', err);
          this.store.dispatch( new DesactivarLoadingAction());
      });

    }).catch( err => {
      console.log('error crearUsuario: ', err);
      Swal.fire('Error en el login', err.message, 'error');
      this.store.dispatch( new DesactivarLoadingAction());
    });
  }

  loginUser( email: string, password: string ) {
    this.store.dispatch( new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword( email, password)
    .then( res => {
      console.log('success: ', res);
      this.router.navigate(['/']);
      this.store.dispatch( new DesactivarLoadingAction());
    }).catch( err => {
      console.log('error: ', err);
      Swal.fire('Error en el login', err.message, 'error');
      this.store.dispatch( new DesactivarLoadingAction());
    });
  }

  logout() {
    this.store.dispatch(new UnsetUserAction());
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

  getUsuario() {
    return { ... this.usuario };
  }
}
