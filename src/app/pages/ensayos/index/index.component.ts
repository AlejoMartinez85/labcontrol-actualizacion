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
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';

moment.locale('es-CO');

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss',
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
export class IndexComponent implements OnInit {

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

  tabactive: string = 'tab-proceso';
  indicadores: any;
  pagos: any;
  user: any;
  tipocomentario: number;
  tabactivesol: string;
  paso2: any;
  paso2enproceso: any = [];
  paso2completados: any = [];
  totalpaso1 = 0;
  totalpaso2 = 0;
  totalpaso2ref = 0;
  totalpaso3 = 0;
  cantidadPaso3 = 0;
  cantidadEnProcesoPasoDos = 0;
  cantidadCompletadoPasoDos = 0;
  totalCompletado = 0;
  @ViewChild('tabsetadmin') tabset: any;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private muestraService: MuestraService,
    private route: ActivatedRoute,
    private rolesPermisosServices: RolesPermisosService ) {
    this.ensayo = new Ensayo();
    this.tipocomentario = 1;
    this.Permisos = new Permisos();
  }

  obtieneEnsayosForPasos() {
    this.totalpaso3 = 0;
    this.totalpaso2 = 0;
    this.totalCompletado = 0;
    this.totalpaso2ref = 0;
    this.totalpaso1 = 0;
    this.cantidadPaso3 = 0;
    let paso2enproceso = [], paso2completados = [];
    this.ensayoservice.getpasos(1).subscribe( valores => {
      if (valores.success) {
        this.paso2 = valores.paso2;
        this.paso2.forEach(element => {
          if (element.estado === 'En Proceso') {
            this.cantidadEnProcesoPasoDos = this.cantidadEnProcesoPasoDos + 1;
            this.totalpaso2 = this.totalpaso2 + element['total'];
            paso2enproceso.push(element);
          }
          if ( element.estado === 'Completado') {
            this.cantidadCompletadoPasoDos = this.cantidadCompletadoPasoDos + 1;
            this.totalCompletado = this.totalCompletado + element['total'];
            paso2completados.push(element);
          }
          this.totalpaso2ref = this.totalpaso2ref + element['total'];
        });
        this.paso2enproceso = paso2enproceso;
        this.paso2completados = paso2completados;
      }
    })
  }

  ngOnInit() {
    // this.obtieneEnsayosForPasos();
    // con esto no se cuenta 2 veces en tarjeta los items
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Ensayos[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
    const $invite = this.route.snapshot.queryParamMap.get('invite');
    if ($invite != undefined) {

    }
    this.tabdata();
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Ensayos[0];
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  openMyModal(event) {
    this.ensayo = new Ensayo();
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');

  }
  
  editarEnsayo(ensayo, tipo) {
    this.ensayoservice.getById(ensayo._id).subscribe((value) => {
      value.ensayos.muestras.forEach((element, index) => {
        this.muestraService.getById(element).subscribe(resp => {
          this.ensayo.muestras[index] = resp.muestra;
        });
      });
      this.openMyModal('effect-3');
      this.ensayo = value.ensayos;
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format('YYYY-MM-DD');
      this.ensayo.fEnsayo = this.ensayo.fEnsayo == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEnsayo).format('YYYY-MM-DD');
      this.ensayo.fEntrega = this.ensayo.fEntrega == undefined ? moment().format('YYYY-MM-DD') : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
      this.ensayo.fFacturado = this.ensayo.fFacturado == undefined ? undefined : moment(this.ensayo.fFacturado).format('YYYY-MM-DD');
      this.ensayo.fVencimiento = this.ensayo.fVencimiento == undefined ? undefined : moment(this.ensayo.fVencimiento).format('YYYY-MM-DD');
      this.ensayo.fpago = this.ensayo.fpago == undefined ? undefined : moment(this.ensayo.fpago).format('YYYY-MM-DD');
      if (this.ensayo.reporte == undefined) {
        this.ensayo.reporte = new Reporte();
      }
      if(tipo === 'proceso') {
        this.tipocomentario = 2;
        setTimeout(() => {
          document.getElementById('resultadoTab').click();
        }, 1000);
      }

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
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
    this.obtieneEnsayosForPasos();
    if (this.tabactive === 'tab-pendientes') {
      this.cargarEnsayos('Pendientes');
    } else if (this.tabactive === 'tab-proceso') {
      this.cargarEnsayos('analistaProceso');
    } else if (this.tabactive === 'tab-finalizado') {
      this.cargarEnsayos('analistaCompletados');
    } else {
      this.cargarEnsayos('analistaProceso');
    }
    
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
  // CALCULA LA VIGENCIA DE DIAS EN TABLA ENSAYOS
  calcularVigencia(fila) {
    const now = moment();
    const fentrega = moment(fila.fEntrega, 'YYYY/MM/DD');
    const dayHoy = now.format('D');
    const dayEntrega = fentrega.format('D');
    const fentregaMes = parseInt(fentrega.format('M'));
    const nowMes = parseInt(now.format('M'));

    if (fentregaMes !== nowMes){
      let difDias = fentrega.diff(now, 'days');
      if (difDias < 0) {
        return difDias;
      } else if (difDias > 0) {
        return difDias = difDias + 1;
      }
      return difDias;
    } else {
      const difDias = parseInt(dayEntrega) - parseInt(dayHoy);
      return difDias;
    }
  }

  clickTabEnsayo(){
    
    const btn = document.getElementById("resultadoTab");
    btn.click();
    
  }
  buscadorpasodosEnproceso(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if(texto.length === 0) {
      this.tabdata();
    } else {
      for (let paso of  this.paso2enproceso) {
        let codigo = paso.codigo.toLowerCase();
        let nombreCliente = paso.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(paso);
        }
      }
      this.paso2enproceso = arrayP1;
    }
  }
  buscadorpasodosCompletados(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if(texto.length === 0) {
      this.tabdata();
    } else {
      for (let paso of  this.paso2completados) {
        let codigo = paso.codigo.toLowerCase();
        let nombreCliente = paso.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(paso);
        }
      }
      this.paso2completados = arrayP1;
    }
  }

}
