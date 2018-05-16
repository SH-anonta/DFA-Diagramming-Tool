import {User} from '../global-models/user.model';

//todo: replace dummy authentication

// WARNING: This service is meant to be used by user service only! Do not use this service directly
export class AuthService {
  //todo remove dummy_users
  private dummy_users= [
    {username : 'anonta', password : 'password'}
  ];

  constructor() {}

  login(username: string, password: string){
    let dummy_users = this.dummy_users;

    function authenticate(resolve, reject){
      let match_found: boolean = -1 != dummy_users.findIndex((x)=> x.username == username && x.password == password);

      if (match_found){
        resolve(new User(username, 'dummyEmail'));
      }
      else{
        reject();
      }
    }

    return new Promise<User>(authenticate);
  }

}
