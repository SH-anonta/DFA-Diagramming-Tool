import {AuthService} from './auth.service';
import {User} from '../global-models/user.model';
import {Injectable} from '@angular/core';


@Injectable()
export class UserService {
  private user: User= null;

  constructor(private authenticator: AuthService){}

  userIsAuthenticated(){
    return this.user!=null;
  }

  login(username: string, password: string): Promise<User>{
    let auth_promise = this.authenticator.login(username, password);

    auth_promise.then((user: User) =>{
      this.user = user;
    });

    return auth_promise;
  }

  logout(){
    this.user = null;
    //todo clear session on the server side
  }

}
