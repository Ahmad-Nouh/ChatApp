import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class XoService {
  static Mysymbol : string;
  static Enemysymbol : string;
  static boxes;
  static grid;
  static visited;
  static i : number;
  static j : number;

  friend : string;

  constructor() {
    XoService.boxes = [];
    XoService.grid = [];
    XoService.i = 0;
    XoService.j = 0;
    XoService.Mysymbol = "X";
    XoService.Enemysymbol = "O";
    XoService.visited = [[0,0,0] , [0,0,0] , [0,0,0]];
  }



  static disableBoxes(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        XoService.grid[i][j].disabled = true;
      }
    }
  }

  static enableBoxes(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        if (!this.visited[i][j])
        XoService.grid[i][j].disabled = false;
      }
    }
  }

  static check(symbol : string){
    let flag = 0;
    let row = 0;
    let col = 0;
    
    //check rows
    for(var i=0;i<3;i++){
      if (XoService.grid[i][0].innerText == XoService.grid[i][1].innerText && 
          XoService.grid[i][1].innerText == XoService.grid[i][2].innerText &&
          XoService.grid[i][0].innerText == symbol)
          {
            flag = 1;
            row = i;
          }
    }
    if (flag)
    {
      $(XoService.grid[row][0]).css("color" , "#79ea8c");
      $(XoService.grid[row][1]).css("color" , "#79ea8c");
      $(XoService.grid[row][2]).css("color" , "#79ea8c");
      return true;
    }

    flag = 0;
    //check columns
    for(var j=0;j<3;j++){
      if (XoService.grid[0][j].innerText == XoService.grid[1][j].innerText && 
          XoService.grid[1][j].innerText == XoService.grid[2][j].innerText &&
          XoService.grid[0][j].innerText == symbol)
      {
        flag = 1;
        col = j;
      }
    }
    if (flag)
    {
      console.log("win");
      $(XoService.grid[0][col]).css("color" , "#79ea8c");
      $(XoService.grid[1][col]).css("color" , "#79ea8c");
      $(XoService.grid[2][col]).css("color" , "#79ea8c");
      return true;
    }

    flag = 0;
    //check quarter
    if (XoService.grid[0][0].innerText == XoService.grid[1][1].innerText && 
      XoService.grid[1][1].innerText == XoService.grid[2][2].innerText &&
      XoService.grid[0][0].innerText == symbol)
    {
      flag = 1;
      console.log("win");
      $(XoService.grid[0][0]).css("color" , "#79ea8c");
      $(XoService.grid[1][1]).css("color" , "#79ea8c");
      $(XoService.grid[2][2]).css("color" , "#79ea8c");
      return true;
    }

    flag = 0;
    //check quarter
    if (XoService.grid[0][2].innerText == XoService.grid[1][1].innerText && 
      XoService.grid[1][1].innerText == XoService.grid[2][0].innerText &&
      XoService.grid[0][2].innerText == symbol)
    {
      flag = 1;
      console.log("win");
      $(XoService.grid[0][2]).css("color" , "#79ea8c");
      $(XoService.grid[1][1]).css("color" , "#79ea8c");
      $(XoService.grid[2][0]).css("color" , "#79ea8c");
      return true;
    }
    return false;
  }

  static checkWinner(){
    if (XoService.check(this.Mysymbol)){
      //handle win
      XoService.disableBoxes();
      XoService.removeClickEvent();
      alert("You win");
    }
    else if (XoService.check(this.Enemysymbol))
    {
      //handle lose
      XoService.disableBoxes();
      XoService.removeClickEvent();
      alert("You Lose");
    }
  }

  static removeClickEvent(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        $(XoService.grid[i][j]).off('click');
      }
    }
  }

}