import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor() { 

    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit() {
  }

}
