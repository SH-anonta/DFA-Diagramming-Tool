import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('Form') form_ref: ElementRef;
  @ViewChild('Form') form: NgForm;


  constructor() { }

  ngOnInit() {
    // this.form = this.form_ref.nativeElement;
    // console.log(this.form);
  }


  onFormSubmit(event: NgForm){
    console.log(event);
  }
}
