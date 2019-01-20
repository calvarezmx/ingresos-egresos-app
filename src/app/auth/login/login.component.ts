import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor( private authService: AuthService ) { }

  ngOnInit() {
  }

  submitLogin( data ) {
    console.log('submitLogin: ', data);
    this.authService.loginUser( data.email, data.password );
  }

}
