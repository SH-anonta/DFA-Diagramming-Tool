export class User {
  readonly username: string;
  readonly email: string;

  constructor(username: string, email: string){
    this.username = username;
    this.email= email;
  }
}
