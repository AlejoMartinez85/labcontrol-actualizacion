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
import { ActividadService } from '../../../services/actividad/actividad.service';
import { Actividad } from '../../../models/actividad';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss',
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
export class ReporteComponent implements OnInit {

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

  paso1: any;
  paso2: any;
  paso3: any;
  paso3Reportados:any;
  paso3EnReporte:any;
  totalpaso1 = 0;
  totalpaso2 = 0;
  totalpaso3ref = 0;
  totalpaso3 = 0;
  cantidadPaso3 = 0;
  cantidadEnProcesoPasoDos = 0;

  tipocomentario: any;
  tabactivesol: string;
  @ViewChild('tabsetadmin') tabset: any;
  actividad;
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
    private actividadService: ActividadService,
    private route: ActivatedRoute, 
    private rolesPermisosServices: RolesPermisosService) {
    this.ensayo = new Ensayo();
    this.Permisos = new Permisos();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Ensayos[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
    if (this.user.tercero.tipo == 1){
      this.tabactive = 'tab-finalizado'
    }
    const $invite = this.route.snapshot.queryParamMap.get('invite');
    this.tabdata();
    // this.obtieneEnsayosForPasos();
    // no cuente doble vez dinero
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
  obtieneEnsayosForPasos() {
    this.totalpaso3 = 0;
    this.totalpaso2 = 0;
    this.totalpaso3ref = 0;
    this.totalpaso1 = 0;
    this.cantidadPaso3 = 0;
    this.paso3EnReporte = [];
    const paso3EnReporte = [], paso3Reportados = [];
    this.ensayoservice.getpasos(1).subscribe( valores => {
      if (valores.success) {
        this.paso1 = valores.paso1;
        this.paso2 = valores.paso2;
        this.paso3 = valores.paso3;
        this.paso3.forEach(element => {

            if (element.estado === 'En Reporte') {
              this.cantidadPaso3 = this.cantidadPaso3 + 1;
              this.totalpaso3 = this.totalpaso3 + element['total'];
              paso3EnReporte.push(element)
            }
            if (element.estado === 'Reportado'){
              paso3Reportados.push(element)
            }
            this.totalpaso3ref = this.totalpaso3ref + element['total'];
        });
        this.paso3EnReporte = paso3EnReporte;
        this.paso3Reportados = paso3Reportados;
        console.log(this.paso3Reportados)
      }
    })
  }

  openMyModal(event) {
    setTimeout(() => {
      document.getElementById('reporteTab').click();
    }, 1000);
    this.ensayo = new Ensayo();
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');

  }

  editarEnsayo(ensayo) {
    console.log(ensayo)
    this.ensayoservice.getById(ensayo._id).subscribe((value) => {
      value.ensayos.muestras.forEach((element, index) => {
        this.muestraService.getById(element).subscribe(resp => {
          this.ensayo.muestras[index] = resp.muestra;
        });
      });
      this.openMyModal('effect-3');
      this.ensayo = value.ensayos;
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format('YYYY-MM-DD');
      this.ensayo.fEnsayo = this.ensayo.fEnsayo == undefined ? undefined : moment(this.ensayo.fEnsayo).format('YYYY-MM-DD');
      this.ensayo.fEntrega = this.ensayo.fEntrega == undefined ? undefined : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
      this.ensayo.fFacturado = this.ensayo.fFacturado == undefined ? undefined : moment(this.ensayo.fFacturado).format('YYYY-MM-DD');
      this.ensayo.fVencimiento = this.ensayo.fVencimiento == undefined ? undefined : moment(this.ensayo.fVencimiento).format('YYYY-MM-DD');
      this.ensayo.fCompletado= this.ensayo.fCompletado == undefined ? undefined : moment(this.ensayo.fCompletado).format('YYYY-MM-DD');
      this.ensayo.fpago = this.ensayo.fpago == undefined ? undefined : moment(this.ensayo.fpago).format('YYYY-MM-DD');
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
      this.cargarEnsayos('noreporte');
    } else if (this.tabactive === 'tab-finalizado') {
      this.cargarEnsayos('reporte');
    } else {
      this.cargarEnsayos('noreporte');
    }
    
  }

  buscadorpasodosCompletadossinReporte(event) {
      const texto = event.target.value.toLowerCase();
      const arrayP1 = [];
      if(texto.length === 0) {
        this.tabdata();
      } else {
        for (let noPagos of  this.paso3EnReporte) {
          let codigo = noPagos.codigo.toLowerCase();
          let nombreCliente = noPagos.nombreCliente.toLowerCase();
          if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
            arrayP1.push(noPagos);
          }
        }
        this.paso3EnReporte = arrayP1;
      }
    }
  buscadorpasodosCompletadosconReporte(event) {
      const texto = event.target.value.toLowerCase();
      const arrayP1 = [];
      if(texto.length === 0) {
        this.tabdata();
      } else {
        for (let noPagos of  this.paso3Reportados) {
          let codigo = noPagos.codigo.toLowerCase();
          let nombreCliente = noPagos.nombreCliente.toLowerCase();
          if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
            arrayP1.push(noPagos);
          }
        }
        this.paso3Reportados = arrayP1;
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

  eliminar(element) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar este Ensayo ?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
      // if (result.value) {
      //   this.ensayo.estado = 'Eliminado';
      //   this.guardarEnsayo();
      // }
      this.guardarActividades('Eliminó la solicitud de ensayo', 'Ensayo', element);
      this.ensayoservice.delete(element).subscribe(resp => {
        this.tabdata();
        this.closeMyModal('effect-3');
      });
    }
    );
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
  verInfoPagos() {
    const tabInfoPagos = document.getElementById("pagosTab");
    tabInfoPagos.click();
  }
  guardarActividades(descripcion, tipoComentario, id) {
    console.log(this.ensayo)
    let actividad = new Actividad();
    actividad.cliente = this.ensayo.cliente;
    actividad.descripcion = descripcion;
    actividad.ensayo = id;
    actividad.tercero = this.user.tercero;
    actividad.usuario = this.user.id;
    actividad.fecha = new Date().toISOString().split('T')[0];
    actividad.nombreUsuarioCreador = this.user.name;
    actividad.tipoComentario = tipoComentario;
    this.actividadService.add(actividad).subscribe((value) => {

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'No se pudo almacenar la audirotia ', type: 'error' });
    });
  }
  calcularVigenciaFactura(fila) {
    let now = moment();

    var fvencimiento = moment(fila.fVencimiento, 'YYYY/MM/DD');

    var dayHoy = now.format('D');
    var dayVencimiento = fvencimiento.format('D');

    var difDias = parseInt(dayVencimiento) - parseInt(dayHoy);

    if (isNaN(difDias)) {
      var info = 'n';
      return info;
    }

    return difDias;

  }
  
}
