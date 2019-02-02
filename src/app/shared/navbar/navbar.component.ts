import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {

  user: User;
  ieListenerSubscription: Subscription = new Subscription();

  constructor( private authService: AuthService, private store: Store<AppState> ) { }

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

}
