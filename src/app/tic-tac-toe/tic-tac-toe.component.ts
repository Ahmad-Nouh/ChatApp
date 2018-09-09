import { XoService } from './../services/xo.service';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './../services/websocket.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})


export class TicTacToeComponent implements OnInit {
  static friend : string;

  constructor(private route : ActivatedRoute , private xoservice : XoService) { }

  ngOnInit() {
    console.log("tic");
    TicTacToeComponent.friend = this.route.snapshot.paramMap.get("friend");
    //to hide waiting
    $(".section").css("display","none");
    //to show game
    $("#game").css("display","block");
    //initilize boxes
    this.xoservice.friend = TicTacToeComponent.friend;
    /* TicTacToeComponent.initBoxes();
    TicTacToeComponent.init(); */
    TicTacToeComponent.reset();
  }

  static initBoxes(){
    let This = this;
    XoService.boxes = document.getElementsByClassName("box");
    //convert 1D array(boxes) to 2D array(grid)
    let col=0 ,temp = [];
    for(let i=0;i<XoService.boxes.length;i++){
        let element = XoService.boxes[i];
        temp.push(element);
        col++;
        if (col==3){
          XoService.grid.push(temp);
          col=0;
          temp = [];
        }
    }
    console.log(XoService.grid);
  }

  static init(){
    for (let i=0;i<3;i++){
      for (let j=0;j<3;j++){
        let This = this;
        //add event listener for listening to click event
        let box = XoService.grid[i][j];
        $(box).on('click',(function(k , l){
          return function(){
            //update the box color and add symbol when it clicked
            this.innerText = XoService.Mysymbol;
            $(this).css("color","#163172");
            $(this).css("background-color","#D6E4F0");
            //-----------------------------
            XoService.disableBoxes();
            XoService.visited[k][l] = 1;
            //the position of box which has been clicked
            XoService.i = k;
            XoService.j = l;

            let obj ={
              type : "Game_XO",
              data : {
                i : XoService.i,
                j : XoService.j,
                symbol : XoService.Mysymbol,
                sender : UserService.username,
                reciver : This.friend
              }
            }
            WebsocketService.sendRequest(obj);
            console.log(obj);
            
            XoService.checkWinner();
            $(this).off('click');
          }
        })(i , j));
      }
    }
  }

  static reset(){
    XoService.boxes = [];
    XoService.grid = [];
    XoService.visited = [[0,0,0] , [0,0,0] , [0,0,0]];
    this.initBoxes();
    this.init();
    for (let i=0;i<3;i++){
      for (let j=0;j<3;j++){
        let box = $(XoService.grid[i][j]);
        box.html("&nbsp;");
        box.css("background-color","#163172");
        box.css("color","#D6E4F0");
        XoService.grid[i][j].disabled = false;
      }
    }
  }

  replay(){
    return TicTacToeComponent.reset();
  }
}