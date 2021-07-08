import { Component, OnInit,Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import { NotificationService } from '../../../shared/notification';
@Component({
  selector: 'app-incertidumbre-detalle-muestra',
  templateUrl: './incertidumbre-detalle-muestra.component.html',
  styleUrls: ['./incertidumbre-detalle-muestra.component.scss'],
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
export class IncertidumbreDetalleMuestraComponent implements OnInit {

  @Input() muestraSeleccionada: any;
  @Input() parametroresult: any;
  ensayo: Ensayo;
  ensayos: any;
  indicadores: any;
  pagos: any;
  @Input() validacionCheck: boolean;
  tabactive: string;
  constructor(private route: ActivatedRoute,
    private ensayoservice: EnsayoService,
    private notificationService: NotificationService) { }
  public beforeChange($event: NgbTabChangeEvent) {
    this.tabactive = $event.nextId;
    this.tabdata();
  }
  tabdata() {
    if (this.tabactive === 'tab-pendientes') {
      this.cargarEnsayos('Pendientes');
    } else if (this.tabactive === 'tab-proceso') {
      this.cargarEnsayos('Proceso');
    } else if (this.tabactive === 'tab-finalizado') {
      this.cargarEnsayos('Finalizado');
    } else {
      this.cargarEnsayos('Pendientes');
    }
  }
  cargarEnsayos(estado) {
    const $id = this.route.snapshot.paramMap.get('id');
    this.ensayoservice.getClienteCLi($id, 1, estado).subscribe((value: any) => {

      this.ensayos = value.ensayos;
      this.indicadores = value.indicadores;
      this.pagos = value.pagos;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  ngOnInit() {
  }

}
