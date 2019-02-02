import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  itemsSubscription: Subscription = new Subscription();

  constructor( private store: Store<AppState>,
    public ieService: IngresoEgresoService ) { }

  ngOnInit() {
    this.itemsSubscription = this.store.select('ingresoEgreso').subscribe( ingresoEgreso => {
      this.items = ingresoEgreso.items;
      console.log('items detalle: ', ingresoEgreso.items);
    });
  }

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
  }

  borrarItem( ie: IngresoEgreso ) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Quieres borrar el registro:  ' + ie.descripcion,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      console.log('resul swal: ', result);
      if (result.value) {
        this.ieService.borrarIngresoEgreso(ie.uid)
        .then( res => {
          console.log('success borrarItem: ', res);

            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
        }).catch( err => {
          // console.log('err borrarItem: ', err);
          Swal.fire('Error al borrar ingreso egreso', err.message, 'error');
        });
    }
    });
  }

}
