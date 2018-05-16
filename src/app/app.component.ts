import {Component, OnInit} from '@angular/core';
import {AuthService} from './global-services/auth.service';
import {User} from './global-models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  constructor(private auth: AuthService){

  }

  ngOnInit(){
    this.driverMethod();
  }

  driverMethod(){
    console.log('----Driver code starts');

    let login_promise = this.auth.login('anonta', 'password');
    login_promise.then(()=> console.log('login successful'));
    login_promise.catch(()=> console.log('login failed'));

    console.log('----Driver code ends');
  }
}
