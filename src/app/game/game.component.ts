import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameName : string;
  constructor(private route : ActivatedRoute) { }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('game_name');
  }

}
