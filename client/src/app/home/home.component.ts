import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  subscription: Subscription;
  bars: any[];
  barsData: any[];
  going: string[] = []; // array of business ids of bars that I'm going
  error: string;
  loading: boolean;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    this.searchForm = new FormGroup({'query': new FormControl('', Validators.required)});
    this.apiService.getBars()
      .then(barsData => {
        this.barsData = barsData;
      })
      .catch(this.handleError.bind(this));

    if(this.isAuthenticated()) {
      this.getBarsGoing();
    }

    this.subscription = this.authService.userLogInChange
      .subscribe(
        (loggedIn: boolean) => {
          if(loggedIn) {
            this.getBarsGoing();
          } else {
            this.going = [];
          }
        }
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const { query } = this.searchForm.value;
    this.loader(true);
    this.apiService.search(query)
      .then(res => {
        this.loader(false);
        this.bars = res.data.businesses;
      })
      .catch(this.handleError.bind(this));
  }

  toggleGoing(id: string) {
    this.apiService.goToBar(id, !(this.going.indexOf(id) !== -1))
      .then(data => {
        this.going = data.going;
        this.barsData = data.bars;
      })
      .catch(this.handleError.bind(this));
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  goingInBar(id: string) {
    return this.going.indexOf(id) !== -1;
  }

  onLogout() {
    this.authService.logout();
  }

  private getBarsGoing() {
    this.apiService.getBarsGoing()
      .then(data => {
        this.going = data.going;
        this.barsData = data.bars;
      });
  }

  private loader(set: boolean) {
    this.loading = set;
  }

  private handleError(error: string) {
    this.loader(false);
    this.error = error;
  }
}
