import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subscription: Subscription;

  constructor( private authService: AuthService,
    public store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submitLogin( data ) {
    // console.log('submitLogin: ', data);
    this.authService.loginUser( data.email, data.password );
  }

}
