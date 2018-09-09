import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private route : ActivatedRoute) { }

  private user : string;

  ngOnInit() {
    this.user = this.route.snapshot.paramMap.get('user');
  }

  LogOut(){
    WebsocketService.sendRequest({
      type : 'ID',
      data : {
        ID : WebsocketService.messageID,
        username : UserService.username
      }
    });
    console.log("last ID is: "+ WebsocketService.messageID);
    WebsocketService.ws.close();
    setTimeout(function() {
      window.location.href = "http://localhost:4200/";
    }
    , 1500)
  }
}
