import { Component, OnInit,Input } from '@angular/core';
import { EquipoService } from '../../../services/equipo/equipo.service';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-incertidumbre-detalle-var',
  templateUrl: './incertidumbre-detalle-var.component.html',
  styleUrls: ['./incertidumbre-detalle-var.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class IncertidumbreDetalleVarComponent implements OnInit {
  @Input() item: any;
  formulaactual: any;
  reload: boolean;
  equipos: any;
  equipoSeleccionado: any;
  opcionesVariables: any;
  constructor( private equipoService: EquipoService,) {
    this.reload=false;

   }

  ngOnInit() {
    this.formulaactual = this.item.formulaCoeficiente;
    this.getEquipos();
    this.getEquipoById();
    this.reload=true;
  }
  getEquipos() {
    this.equipoService.getOption(0).subscribe((result: any) => {
      this.equipos = result.data;
    });
  }
  getEquipoById() {
    let id;
    id =this.item.equipoId;
    if (id != undefined) {
      this.equipoService.getById(id).subscribe((result: any) => {
        this.equipoSeleccionado = result.data;
        this.opcionesVariables = this.crearOpcionVariablesEquipo(this.equipoSeleccionado.variables);
      });
    }
  }
  crearOpcionVariablesEquipo(variables) {
    const opciones = variables.map(function (item) {

      return { label: item.nombre, value: item._id };
    });
    return opciones;

  }
}
