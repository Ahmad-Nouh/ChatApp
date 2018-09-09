/* import { async } from '@angular/core/testing'; */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class UserService {

  private static firstname : string;
  private static lastname : string;
  public static username : string;
  private static password : string;
  public static friends : any;
  public static chats;
  private static blockList : string[];

  private static isUserLogin : boolean;
  private static isUserSignUp : boolean;

  //e2ee
  private static e2ee : any[];


  constructor(private router : Router){
    UserService.isUserLogin = false;
    UserService.blockList = [];
    UserService.e2ee = [];

  }

  public getChats() : string [] { return UserService.chats; }
  public getFriends() : string [] { return UserService.friends; }
  public getFirstname() : string {return UserService.firstname; }
  public getLastname() : string {return UserService.lastname; }

  public static get_UserLogin() :boolean { return UserService.isUserLogin; }
  public static set_UserLogin() :void { UserService.isUserLogin = true; }
  public static get_UserSignUp() :boolean { return UserService.isUserSignUp; }
  public static set_UserSignUp() :void { UserService.isUserSignUp = true; }
  public static set_Password(password : string) : void {UserService.password = password;}
  public static get_Password() :string { return UserService.password; }

  public static addToBlockList(user : string){
    this.blockList.push(user);
  }
  public static checkIfBlocked(user : string){
    let check = this.blockList.indexOf(user);
    if (check < 0) return false;
    else
    return true;
  }

  public static addToE2EE(username , sharedSecret){
    let pair = {
      username : username,
      sharedSecret : sharedSecret
    }
    UserService.e2ee.push(pair);
  }
}
