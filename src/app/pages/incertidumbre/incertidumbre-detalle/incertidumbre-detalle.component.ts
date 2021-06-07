import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-incertidumbre-detalle',
  templateUrl: './incertidumbre-detalle.component.html',
  styleUrls: ['./incertidumbre-detalle.component.scss']
})
export class IncertidumbreDetalleComponent implements OnInit {
  @Input() parametro: any;
  @Input() parametroresult: any;
  @Input() validacionCheck: boolean;
  formulaactual: any;
  reload: boolean;
  constructor() {

    this.reload=false;
   }

  ngOnInit() {
   console.log(this.parametro)
    this.formulaactual = this.parametro.formula;
    this.reload=true;
  }
  evaluardecimal() {
    if (this.parametro.ndecimales == undefined || this.parametro.ndecimales == '') {
      return '4';
    }
    return this.parametro.ndecimales;
  }

}
