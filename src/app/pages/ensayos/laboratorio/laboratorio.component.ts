import { Component, OnInit, ViewChild } from '@angular/core';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from '../../../shared/notification';
import { Ensayo } from '../../../models/ensayo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Muestra } from '../../../models/muestra';
import swal from 'sweetalert2';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { IOption } from 'ng-select';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EnsayoParametro } from '../../../models/ensayo_parametro';
import { templateSourceUrl } from '@angular/compiler';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Reporte } from '../../../models/reporte';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: [
    './laboratorio.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
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
export class LaboratorioComponent implements OnInit {
  /*ensayo */
  ensayo: Ensayo;
  muestraAdd: Muestra;
  form: FormGroup;
  parametros: any;
  parametronew: any;
  muestras: any;
  muestrasel: any;
  ensayos: any;
  columns: any[];
  @ViewChild('modaladd') modaladd: any;
  tabactive: string;
  indicadores: any;
  pagos: any;
  tabactivesol: string;
  tipocomentario: number;
  paso1: any;
  paso2: any;
  paso3: any;
  user: any;
  totalpaso1 = 0;
  totalpaso2 = 0;
  totalpaso3 = 0;
  cantidadPaso3 = 0;
  @ViewChild('tabset') tabset: any;
  constructor(
    private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private muestraService: MuestraService,
    private route: ActivatedRoute
  ) {
    this.ensayo = new Ensayo();
    this.tipocomentario = 1;
    this.paso1 = [];
    this.paso2 = [];
    this.paso3 = [];
  }
  ngOnInit() {
    const $invite = this.route.snapshot.queryParamMap.get('invite');
    if ($invite != undefined) {
    }
    this.tabdata();
    this.tabactive = 'tab-finalizado';
  }

  openMyModal(event) {
    this.ensayo = new Ensayo();
    this.ensayo.creocli = true;
    this.ensayo.creolab = false;
    this.ensayo.estado = 'Cotización';
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');
  }

  editarEnsayo(ensayo) {
    this.ensayoservice.getById(ensayo._id).subscribe(
      value => {
        this.openMyModal('effect-3');
        this.ensayo = value.ensayos;
        this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format(
          'YYYY-MM-DD'
        );
        this.ensayo.fEnsayo =
          this.ensayo.fEnsayo == undefined
            ? undefined
            : moment(this.ensayo.fEnsayo).format('YYYY-MM-DD');
        this.ensayo.fEntrega =
          this.ensayo.fEntrega == undefined
            ? undefined
            : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
        this.ensayo.fFacturado =
          this.ensayo.fFacturado == undefined
            ? undefined
            : moment(this.ensayo.fFacturado).format('YYYY-MM-DD');
        this.ensayo.fVencimiento =
          this.ensayo.fVencimiento == undefined
            ? undefined
            : moment(this.ensayo.fVencimiento).format('YYYY-MM-DD');
        this.ensayo.fpago =
          this.ensayo.fpago == undefined
            ? undefined
            : moment(this.ensayo.fpago).format('YYYY-MM-DD');
        if (this.ensayo.reporte == undefined) {
          this.ensayo.reporte = new Reporte();
        }
        if (this.tabactive === 'tab-finalizado') {
          this.tabset.select('reporteTab');
        }
      },
      err => {
        this.notificationService.addNotify({
          title: 'Alerta',
          msg: 'Por favor valide los datos ',
          type: 'error'
        });
      }
    );
  }

  cargarEnsayos(estado) {
    console.log(this.paso1)
    console.log(this.paso2)
    console.log(this.paso3)
    if (
      this.paso1.length <= 0 ||
      this.paso2.length <= 0 ||
      this.paso3.length <= 0
    ) {
      this.ensayoservice.getEstado(1, estado).subscribe(
        value => {
          this.ensayos = value.ensayos;
          this.indicadores = value.indicadores;
          this.pagos = value.pagos;
          switch (estado) {
            case 'Pendientes':
              this.paso1 = value.ensayos;
              break;
            case 'Proceso':
              this.paso2 = value.ensayos;
              break;
            case 'Finalizado':
              this.paso3 = value.ensayos;
              break;
          }
        },
        err => {
          this.notificationService.addNotify({
            title: 'Alerta',
            msg: 'Por favor valide los datos ',
            type: 'error'
          });
        }
      );
    }
  }
  reloaddata(value) {
    if (value == 'cargar') {
      this.tabdata();
    } else if (value == 'hide') {
      this.closeMyModal(null);
    }
  }

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
  calcularVigencia(fila) {
    let now = moment();
    let b = moment(fila.fEntrega);
    return b.diff(now, 'days');
  }
  beforeChangeEnsayo($event: NgbTabChangeEvent) {
    this.tabactivesol = $event.nextId;
    if (this.tabactivesol === 'solicitudTab') {
      this.tipocomentario = 1;
    } else if (this.tabactivesol === 'resultadoTab') {
      this.tipocomentario = 2;
    } else if (this.tabactivesol === 'reporteTab') {
      this.tipocomentario = 3;
    } else {
      this.tipocomentario = 1;
    }
  }
}
