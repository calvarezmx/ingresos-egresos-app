import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ieListenerSubscription: Subscription = new Subscription();
  ieItemsSubscription: Subscription = new Subscription();

  constructor( private afDb: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState> ) { }

  initIngresoEgresoListener() {
    this.ieListenerSubscription = this.store.select('auth')
    .pipe(
      filter( auth => auth.user != null )
    )
    .subscribe( auth => {
      console.log('auth: ', auth);
      this.ngresoEgresoItems( auth.user.uid);
    });
  }

  private ngresoEgresoItems( uid: string ) {
    this.ieItemsSubscription = this.afDb.collection(`${ uid }/ingresos-egresos/items`).snapshotChanges()
    .pipe(
      map( items => {
        return items.map( item => {
          return {
            uid: item.payload.doc.id,
            ...item.payload.doc.data()
          };
        });
      })
    )
    .subscribe( (items: any[]) => {
      console.log('items: ', items);
      this.store.dispatch( new SetItemsAction(items));
    });
  }

  cancelarSubscriotions() {
    this.ieListenerSubscription.unsubscribe();
    this.ieItemsSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${ user.uid }/ingresos-egresos`).collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso( uid: string ) {
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${ user.uid }/ingresos-egresos/items/${ uid }`).delete();
  }
}
