import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://thejavascript.zone/api/v1';


  constructor(private http: HttpClient) {
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({'Content-Type': 'application/json'});
  }


  public getUsers() {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/user`, {headers});
  }

  public getUser(id: string) {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/user/${id}`, {headers});
  }
  public getFile(id: string) {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/file/${id}`, {headers});
  }

  public deleteUser(id: string) {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/user/${id}`, {headers});
  }


  public createUser(data: any) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/user`, data, {headers});
  }
  public createFile(data: any) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/file`, data, {headers});
  }

  public updateUser(id: string, data: any) {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/user/${id}`, data, {headers});
  }

  public uploadPhoto(selectedFile: File) {
    const uploadData = new FormData();
    uploadData.append('uploaded_file', selectedFile, selectedFile.name);
    return this.http.post(`${this.apiUrl}/photo`, uploadData);
  }
  public uploadFile(selectedFile: File) {
    const uploadData = new FormData();
    uploadData.append('uploaded_file', selectedFile, selectedFile.name);
    return this.http.post(`${this.apiUrl}/files`, uploadData);
  }

}
