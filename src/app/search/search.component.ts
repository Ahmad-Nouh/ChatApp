import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private Results : string[];

  constructor() { }

  ngOnInit() {
  }

  searchUser(event)
  {
    let Query = event.target.value;
    $("#results").empty();
    WebsocketService.sendRequest({
      type : "match_search",
      data : {
        query : Query
      }
    })
  }

  sendFriendReq(user : string){
    
  }
}
