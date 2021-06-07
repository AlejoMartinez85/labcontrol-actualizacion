import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion-view',
  templateUrl: './configuracion-view.component.html',
  styleUrls: ['./configuracion-view.component.scss']
})
export class ConfiguracionViewComponent implements OnInit {
  user: any;
  constructor() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit() {
  }

}
