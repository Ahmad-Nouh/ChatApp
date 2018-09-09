import { Injectable } from '@angular/core';


export interface Record{
  messages : any[];
  size : number;
}

@Injectable()
export class ChatService {
  public static history : Map<string , Record[]> = new Map<string , Record[]>();
  public static recordIndex : number = 1;

  constructor() {
  }
  
  
}
