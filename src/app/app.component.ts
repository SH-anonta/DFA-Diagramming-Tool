import {Component, OnInit} from '@angular/core';
import {User} from './global-models/user.model';
import {UserService} from './global-services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private user: UserService){}

  ngOnInit(){
    this.driverMethod();
  }

  driverMethod(){
    console.log('----Driver code starts');
    // let login_promise = this.user.login('anonta', 'password');
    // login_promise.then((user: User)=> {console.log('login successful', user); });
    // login_promise.catch(()=> console.log('login failed'));
    console.log('----Driver code ends');
  }
}
