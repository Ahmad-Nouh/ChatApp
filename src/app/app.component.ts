import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  constructor(private websocketservice : WebsocketService){
    console.log("before");
    this.websocketservice.connect();
    console.log("after");
  }
  ngOnInit():void
  {

  }
}
