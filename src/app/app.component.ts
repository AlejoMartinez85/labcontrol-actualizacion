import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { NotificationService } from './shared/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lAbControlIms';
  options = {};

  constructor(
    private router: Router,
    private notificationService: NotificationService
    ) { }
    
    ngOnInit() {
    this.options = this.notificationService.options;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
