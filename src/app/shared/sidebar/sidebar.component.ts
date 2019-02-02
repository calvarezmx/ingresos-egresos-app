import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  user: User;
  ieListenerSubscription: Subscription = new Subscription();

  constructor( public authService: AuthService,
    private store: Store<AppState>,
    public ieService: IngresoEgresoService ) { }

  ngOnInit() {
    this.ieListenerSubscription = this.store.select('auth')
    .pipe(
      filter( (auth: any) => auth.user != null )
    )
    .subscribe( auth => {
      this.user = auth.user;
    });
  }

  ngOnDestroy() {
    this.ieListenerSubscription.unsubscribe();
  }

  logout() {
    this.ieService.cancelarSubscriotions();
    this.authService.logout();
  }
}
