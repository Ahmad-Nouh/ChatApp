import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router : Router) {
  }

  ngOnInit() {
  }

  Login(user : NgForm){
    let username = user.form.get('username').value;
    let password = user.form.get('password').value;
    
    UserService.set_Password(password);
    UserService.username = username;

    let message = {
      type : "login" , 
      data : {
        username : username,
        password : password
      }
    }

    WebsocketService.sendRequest(message);

    //-------------------

    //this.router.navigate(["/"+ UserService.username +"/profile"]);
  }

}