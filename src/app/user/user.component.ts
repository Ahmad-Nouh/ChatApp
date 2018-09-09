import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private router: Router , private route : ActivatedRoute) {
    //WebsocketService.connect();
  }
  ngOnInit() {
    var user = this.route.snapshot.paramMap.get('user');
    //Get Chat List
    WebsocketService.sendRequest({
      type :"chat_list",
      data :{
        username : UserService.username
      }
    });
    //Get Friends List
    WebsocketService.sendRequest({
      type :"friends_list",
      data :{
        username : UserService.username
      }
    });
  }

}
