import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import * as moment from 'moment';
import { Reporte } from '../../../models/reporte';
import { NotificationService } from '../../../shared/notification';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ver-muestra',
  templateUrl: './ver-muestra.component.html',
  styleUrls: ['./ver-muestra.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss'],
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
export class VerMuestraComponent implements OnInit {
  $identificador;
  ensayosCargados: Boolean = false;
  ensayo: any;
  tabactive: string;
  Muestra = [];
  Ensayos = [];
  ensayos: any;
  indicadores: any;
  tabactivesol: string;
  pagos: string;
  user: any;
  tipocomentario;
  @ViewChild('tabsetadmin') tabset: any;
  public myAngularxQrCode: string = null;
  constructor(private router: ActivatedRoute,
    private muestraService: MuestraService,
    private routernavegate: Router,
    private ensayoservice: EnsayoService,
    private notificationService: NotificationService) {
      this.ensayo = new Ensayo();
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.myAngularxQrCode = window.location.href;
    this.muestraService.getById(this.$identificador).subscribe( muestra => {
      if (muestra.success) {
        this.Muestra = muestra.muestra;
      } else {
        this.routernavegate.navigate(['/ensayos/recepcionEnsayo']);
      }
    });

  }
  ngOnInit() {
    this.tipocomentario = 1;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }
  imprimir(qr) {
    const  a = document.createElement('a');
    a.download = `QR Muestra - ${this.Muestra['codigo']}`;
    a.target = '_blank';
    a.href = qr['el']['nativeElement']['childNodes'][1]['currentSrc'];
    a.click();
  }
  
  traeSolicitudes() {
    const ensayos = [];
    this.ensayoservice.getAllEnsayos(1).subscribe(values => {
      if ( values.success ) {

        for (let i = 0; i <= values.ensayos.length - 1; i++) {
          values.ensayos[i].muestras.forEach(element => {
            if (element === this.$identificador) {
              ensayos.push(values.ensayos[i]);
            }
          });
        }
        if (ensayos.length > 0) {
          this.Ensayos = ensayos;
          this.ensayosCargados = true;
        } else  {
          this.notificationService.addNotify({ title: 'Alerta', msg: 'No se encuentran Ensayos asociados a la muestra', type: 'warning' });
          return;
        }
      }
    });
  }
  openMyModal(event) {
    this.ensayo = new Ensayo();
    this.ensayo.creocli = false;
    this.ensayo.creolab = true;
    this.ensayo.fsolicitud = moment().format('YYYY-MM-DD');
    this.ensayo.fEnsayo = moment().format('YYYY-MM-DD');
    this.ensayo.fEntrega = moment().format('YYYY-MM-DD');

    this.ensayo.estado = 'Esperando Confirmación';
    document.querySelector('#' + event).classList.add('md-show');

  }
  editarEnsayo(ensayo) {
    this.ensayo = null;
    this.ensayoservice.getById(ensayo._id).subscribe((value) => {
      this.openMyModal('effect-3');
      this.ensayo = value.ensayos;
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format('YYYY-MM-DD');
      this.ensayo.fEnsayo = this.ensayo.fEnsayo == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEnsayo).format('YYYY-MM-DD');
      this.ensayo.fEntrega = this.ensayo.fEntrega == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
      this.ensayo.fFacturado = this.ensayo.fFacturado == undefined ? undefined : moment(this.ensayo.fFacturado).format('YYYY-MM-DD');
      this.ensayo.fVencimiento = this.ensayo.fVencimiento == undefined ? undefined : moment(this.ensayo.fVencimiento).format('YYYY-MM-DD');
      this.ensayo.fpago = this.ensayo.fpago == undefined ? undefined : moment(this.ensayo.fpago).format('YYYY-MM-DD');
      if (this.ensayo.reporte === undefined) {
        this.ensayo.reporte = new Reporte();
      }
      if (this.tabactive === 'tab-finalizado') {
        this.tabset.select('reporteTab');
      } else if (this.tabactive === 'tab-proceso') {
        this.tabset.select('resultadoTab');
      } else {
        this.tabset.select('solicitudTab');
      }

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
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
  reloaddata(value) {
    if (value === 'cargar') {
      this.tabdata();
    } else if (value === 'hide') {
      this.closeMyModal(null);
    }

  }
  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');

  }
  guardarEnsayo() {
    this.ensayoservice.update(this.ensayo).subscribe((value) => {
      this.tabdata();
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Ensayo Actualizado con exito', type: 'success' });
      this.closeMyModal('effect-3');
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });

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
    this.ensayoservice.getEstado(1, estado).subscribe((value) => {

      this.ensayos = value.ensayos;
      this.indicadores = value.indicadores;
      this.pagos = value.pagos;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  verInfoPagos() {
    const tabInfoPagos = document.getElementById('pagosTab');
    tabInfoPagos.click();
  }
  eliminar() {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar este Ensayo ?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.ensayo.estado = 'Eliminado';
        this.guardarEnsayo();
      }

    );
  }
  
}
