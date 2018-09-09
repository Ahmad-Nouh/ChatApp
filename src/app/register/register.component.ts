import { fullnameValidators } from './custom validators/fullname.validators';
import { usernameValidators } from './custom validators/username.validators';
import { commonValidators } from './custom validators/common.validators';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
  }
  //--------------------------------------------
  form = new FormGroup({
    firstname : new FormControl('',[
      Validators.required ,
      fullnameValidators.containNumbersOrSymbols,
      commonValidators.cannotContainSpace
    ]) ,
    lastname : new FormControl('',[
      Validators.required ,
      fullnameValidators.containNumbersOrSymbols,
      commonValidators.cannotContainSpace
    ]) ,
    username : new FormControl('',[
      Validators.required,
      commonValidators.cannotContainSpace,
      usernameValidators.beginWithNumber,
      Validators.minLength(10),
      usernameValidators.containSymbols
    ]) ,
    password : new FormControl('',[
      Validators.required,
      Validators.minLength(8),
      commonValidators.cannotContainSpace
    ])
  });

  get firstname(){
    return this.form.get('firstname');
  }

  get lastname(){
    return this.form.get('lastname');
  }

  get username(){
    return this.form.get('username');
  }

  get password(){
    return this.form.get('password');
  }


  //--------------------------------------------
  PostUser(user : NgForm){
    let username = user.form.get('username').value;
    let password = user.form.get('password').value;
    let firstname = user.form.get('firstname').value;
    let lastname = user.form.get('lastname').value;
    //post request
    let message = {
      type : "signup",
      data : {
        lastname : lastname ,
        firstname : firstname ,
        username : username ,
        password : password
      }
    }
    WebsocketService.sendRequest(message);
  }
}
