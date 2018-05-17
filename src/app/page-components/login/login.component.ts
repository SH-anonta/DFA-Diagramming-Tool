import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';


import {AuthService} from '../../global-services/auth.service';
import {UserService} from '../../global-services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('Form') form_ref: ElementRef;
  @ViewChild('Form') form: NgForm;


  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.form = this.form_ref.nativeElement;
    // console.log(this.form);
  }


  onFormSubmit(form: NgForm){
    this.userService.login(form.value.username, form.value.password);
  }
}
