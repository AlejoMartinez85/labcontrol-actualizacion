import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-arrays',
  templateUrl: './tabla-arrays.component.html',
  styleUrls: ['./tabla-arrays.component.scss']
})
export class TablaArraysComponent implements OnInit {
  @Input() array: any;
  @Input('') nombre: string = "";

  constructor() { }

  ngOnInit() {
  }

}
