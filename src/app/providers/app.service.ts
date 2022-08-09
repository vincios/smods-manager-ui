import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {FullMod, ModBase, ModRevision, ModStatus} from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api_url = "http://127.0.0.1:5000/api";

  constructor(
    private http: HttpClient
  ) { }


  getFullMod(skyid: string): Observable<FullMod> {
    const url = this.api_url + `/mod/${skyid}/full`;

    return this.http.get<FullMod>(url)
  }

  getBaseMod(skyid: string): Observable<ModBase> {
    const url = this.api_url + `/mod/${skyid}/base`;

    return this.http.get<FullMod>(url)
  }

  getModOtherRevisions(skyid: string): Observable<ModRevision[]> {
    const url = this.api_url + `/mod/${skyid}/other_revisions`;

    return this.http.get<ModRevision[]>(url)
  }

  getModStatus(skyid: string): Observable<ModStatus> {
    const url = this.api_url + `/app/status/${skyid}`;

    return this.http.get<ModStatus>(url)
  }

  install(mod_id: string, revision_id: string): Observable<any> {
    const url = this.api_url + '/app/install';
    const params = {
      mod_id: mod_id,
      revision_id: revision_id
    }
    return this.http.post(url, params)
  }

  uninstall(mod_id: string): Observable<any> {
    const url = this.api_url + '/app/uninstall';
    const params = {
      mod_id: mod_id
    }
    return this.http.post(url, params)
  }
}
