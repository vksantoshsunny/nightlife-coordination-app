import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { environment as env } from '../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiService {

  constructor(
    private http: Http,
    private authHttp: AuthHttp) { }

  search(term: string) {
    const url = `${env.apiRootUrl}/search`;
    return this.http.post(url, { query: term })
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.handleError);
  }

  getBars() {
    const url = `${env.apiRootUrl}/bars`;
    return this.http.get(url)
      .toPromise()
      .then((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  goToBar(id: string, going: boolean) {
    const url = `${env.apiRootUrl}/bars/${id}`;
    return this.authHttp.post(url, {status: going})
      .toPromise()
      .then((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  getBarsGoing() {
    const url = `${env.apiRootUrl}/account/bars`;
    return this.authHttp.get(url)
      .toPromise()
      .then((response: Response) => response.json().data)
      .catch(this.handleError);
  }

  private handleError(err: Response|any): Promise<any> {
    if(err instanceof Response) {
      const { error } = err.json();
      return Promise.reject(error.message || error);
    }
    return Promise.reject(err.message || err);
  }
}
