import { Http, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Injectable()
export class FileUploadService {

  constructor(private http : Http) {}

  public upploadFile(formdata : any , url :string){
    return this.http.post(url , formdata);
  }

  public errorHandler(error : Response){
    console.error('Error occured : '+ error);
    return Observable.throw(error || 'Some error on server occured');
  }

  public getFilesList(url : string){
    return this.http.get(url , { responseType: ResponseContentType.Blob });
  }
}
