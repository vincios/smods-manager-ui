import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FullMod } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api_url = "http://127.0.0.1:5000/api";

  constructor(
    private http: HttpClient
  ) { }


  getFullMod(skyid: string): Observable<FullMod> {
    const url = this.api_url + `/mod/full/${skyid}`;

    return this.http.get<FullMod>(url)
  }
}
