import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';


import {UserService} from '../../global-services/user.service';
import {User} from '../../global-models/user.model';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('Form') form_ref: ElementRef;
  @ViewChild('Form') form: NgForm;


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    // this.form = this.form_ref.nativeElement;
    // console.log(this.form);
  }


  onFormSubmit(form: NgForm){
    let promise = this.userService.login(form.value.username, form.value.password);

    promise.then((user: User)=> this.router.navigate(['/'])
    );

  }
}
