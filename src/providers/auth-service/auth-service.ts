import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import 'rxjs/add/operator/map';

let apiUrl = "http://219.83.56.90:81/InSys/uploaded/api/";

@Injectable()
export class AuthServiceProvider {

  constructor(
    public http: Http,
    private transfer: FileTransfer
  ) {
    console.log('Hello AuthServiceProvider Provider');
  }

  postData(credentials, type){
  	return new Promise((resolve, reject) =>{
  		let headers = new Headers();
  		this.http.post(apiUrl+type, JSON.stringify(credentials), {headers: headers}).subscribe(res =>{
  			resolve(res.json());
  		}, (err) =>{
  			reject(err);
  		}); 	
  	
  	});
 
  }

  sendImage(id,filename,targetPath,type){
    return new Promise((resolve,reject) =>{
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'id':id}
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      fileTransfer.upload(targetPath, apiUrl+type, options).then(data => {
        resolve(true);
      }, err => {
        reject(err);
      });
    })
  }

  sendAdmImage(id,filename,targetPath,type){
    return new Promise((resolve,reject) =>{
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'id':id}
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      fileTransfer.upload(targetPath, apiUrl+type, options).then(data => {
        resolve(true);
      }, err => {
        reject(err);
      });
    })
  }


}
