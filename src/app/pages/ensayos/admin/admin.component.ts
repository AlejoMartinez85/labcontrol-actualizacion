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
import { ActividadService } from '../../../services/actividad/actividad.service';
import { Actividad } from '../../../models/actividad';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { Permisos } from '../../../models/Rol';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { AuthenticationService } from '../../../shared/authentication';
moment.locale('es-CO');
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss',
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
export class AdminComponent implements OnInit {
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
  pregunta: string = '1';
  pagos: any;
  paso1: any;
  paso2: any;
  paso3: any;
  user: any;
  totalpaso1 = 0;
  totalpaso2 = 0;
  totalpaso3 = 0;
  cantidadPaso3 = 0;
  no_pagos = [];
  pagados = [];
  tipocomentario: any;
  tabactivesol: string;
  nuevaSolicitud: boolean = false;
  @ViewChild('tabsetadmin') tabset: any;
  actividad;
  Permisos: Permisos;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private userService: UsuariosService,
    private muestraService: MuestraService,
    private actividadService: ActividadService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private rolesPermisosServices: RolesPermisosService) {
    this.ensayo = new Ensayo();
    this.Permisos = new Permisos();
    // this.authService.logout();

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
   if ( localStorage.getItem('permisos')) {
     this.Permisos = JSON.parse(localStorage.getItem('permisos'));
     this.permisosLocal = this.Permisos.Ensayos[0];
   } else {
     this.cargarRoles();
   }
    this.tabdata();
    this.tipocomentario = 1;
  }
  cargarRoles() {
    this.rolesPermisosServices.getRole().subscribe( (item: any)=> {
      // console.log(item)
      if (item.success) {
        if (item.cantidad === 0) {
          const rol = {
            nombre: 'Administrador',
            tercero: this.user.tercero._id
          }
          this.rolesPermisosServices.createRole(rol).subscribe( (resp: any) => {
            if (resp.success) {
              this.user.rol = resp.Rol._id;
              localStorage.removeItem('userInfo');
              localStorage.setItem('userInfo', JSON.stringify(this.user));
              this.userService.update(this.user).subscribe((value) => {
                this.notificationService.addNotify({ title: 'Alerta', msg: 'Usuario actualizado con exito', type: 'success' });
                this.cargarPermisos(this.user.rol);
              }, err => {
                this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valida los datos ', type: 'error' });
              });
            }
          })
          // Creamos lo reoles se cree el rol se asigna a la variable Roles local lo de admin
        } else {
          this.cargarPermisos(this.user.rol);
        }
      }
    })
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {
        if (resp.success) {
          this.Permisos = resp.permisos;
          localStorage.setItem('permisos', JSON.stringify(resp.permisos))
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
    this.totalpaso1 = 0;
    this.cantidadPaso3 = 0;
    this.ensayoservice.getpasos(1).subscribe(valores => {
      if (valores.success) {
        this.paso1 = valores.paso1;
        this.paso2 = valores.paso2;
        this.paso3 = valores.paso3;
        this.paso1.forEach(element => {
          this.totalpaso1 = this.totalpaso1 + element['total'];
        });
        this.paso2.forEach(element => {
          this.totalpaso2 = this.totalpaso2 + element['total'];
        });
        this.paso3.forEach(element => {
          if (!element.informPublicado) {
            this.cantidadPaso3 = this.cantidadPaso3 + 1;
            this.totalpaso3 = this.totalpaso3 + element['total'];
          }
        });
      }
      console.log(this.paso2)
    })
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
    this.tabset.select("solicitudTab");
  }

  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');
    this.nuevaSolicitud = false;

  }
  closeMyModalAyuda(event) {
    document.querySelector('#'+ event).classList.remove('md-show');

  }

  pasoAnterior(ensayo) {
    swal({
      title: 'Alerta!',
      text: '¿ Deseas pasar este ensayo a su paso anterior?',
      showCancelButton: true,
      confirmButtonText: 'Si, pasar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x,
    }).then((result) => {
      let paso = 0;
      let estado = '';
      let estadocount = 0;
      switch (ensayo.paso) {
        case 1 || '1':
          paso = 1;
          estado = 'Esperando Confirmación';
          break;
        case 2 || '2':
          paso = 1;
          estado = 'Esperando Confirmación';
          break;
        case 3 || '3':
          paso = 2;
          ensayo.parametros.forEach(element => {
            element['muestras'].forEach(muestras => {
              if (estadocount === 0) {
                if (muestras['seleccionado']) {
                  if (muestras['valor'] === null || muestras['valor'] === '') {
                    estado = 'En Proceso';
                    estadocount = 1;
                  } else {
                    if (estado === 'En Reporte') {
                      estado = 'En Reporte';
                    } else {
                      estado = 'Completado';
                    }
                  }
                }
              }
            });
          });
      }

      const contenido = {
        _id: ensayo._id,
        paso: paso,
        estado: estado
      };
      this.ensayoservice.updatePaso(contenido).subscribe(resp => {
        if (resp.success) {
          this.closeMyModal(null);
          this.tabdata();
          this.notificationService.addNotify({ title: 'Alerta', msg: resp.message, type: 'success' });
          alert(resp.message);
        }
      });
    });

  }

  editarEnsayo(ensayo, lugar) {

    this.ensayo = null;
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
      if (this.tabactive === 'tab-finalizado') {
        this.tabset.select("reporteTab");
      } else if (this.tabactive === 'tab-proceso') {
        this.tabset.select("resultadoTab");
      } else {
        this.tabset.select("solicitudTab");
      }
      setTimeout(() => {
        if (lugar === 'pagos') {
          document.getElementById('pagosTab').classList.add('active');
          document.getElementById('pagosTab').click();
        }
      }, 1000)
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  cargarEnsayos(estado) {
    this.ensayoservice.getEstado(1, estado).subscribe((value) => {
      this.ensayos = value.ensayos;
      this.indicadores = value.indicadores;
      this.pagos = value.pagos;
      this.no_pagos = this.pagos.nopago.reverse();
      this.pagados = this.pagos.pagados.reverse();
      this.pagos.nopagosVencidos = this.pagos.nopagosVencidos.reverse();
      this.pagos.nopagosVigentes = this.pagos.nopagosVigentes.reverse();

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  reloaddata(value) {
    if (value === 'cargar') {
      this.tabdata();
    } else if (value === 'hide') {
      this.closeMyModal(null);
    }

  }

  public beforeChange($event: NgbTabChangeEvent) {
    this.tabactive = $event.nextId;
    this.tabdata();
  }
  tabdata() {
    this.obtieneEnsayosForPasos();
    switch (this.tabactive) {
      case 'tab-pendientes':
        this.cargarEnsayos('Pendientes');
        break;
      case 'tab-proceso':
        this.cargarEnsayos('Proceso');
        break;
      case 'tab-finalizado':
        this.cargarEnsayos('Finalizado');
        break;
      default:
        this.cargarEnsayos('Pendientes');
        break;
    }
  }
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


  beforeChangeEnsayo($event: NgbTabChangeEvent) {
    this.tabactivesol = $event.nextId;
    if (this.tabactivesol === 'solicitudTab') {
      this.tipocomentario = 1;
    } else if (this.tabactivesol === 'resultadoTab') {
      this.tipocomentario = 2;
    } else if (this.tabactivesol === 'reporteTab') {
      this.tipocomentario = 3;
    } else if (this.tabactivesol === 'pagosTab') {
      this.tipocomentario = 4;
    } else {
      this.tipocomentario = 1;
    }
  }
  eliminar(element) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas  eliminar este Ensayo ?',
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
  calcularVigenciaFactura(fila: any) {
    let now = moment();

    var fvencimiento = moment(fila.fVencimiento, 'YYYY/MM/DD');

    var dayHoy = now.format('D');
    var dayVencimiento = fvencimiento.format('D');

    var difDias = parseInt(dayVencimiento) - parseInt(dayHoy);

    if (isNaN(difDias)) {
      return 'n';
    }

    return difDias;

  }

  buscadorpaso1(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if (texto.length === 0) {
      this.tabdata();
    } else {
      for (let paso of this.paso1) {
        let codigo = paso.codigo.toLowerCase();
        let nombreCliente = paso.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(paso);
        }
      }
      this.paso1 = arrayP1;
    }
  }
  buscadorpaso2(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if (texto.length === 0) {
      this.tabdata();
    } else {
      for (let paso of this.paso2) {
        let codigo = paso.codigo.toLowerCase();
        let nombreCliente = paso.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(paso);
        }
      }
      this.paso2 = arrayP1;
    }
  }
  buscadorpaso3(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if (texto.length === 0) {
      this.tabdata();
    } else {
      for (let paso of this.paso3) {
        let codigo = paso.codigo.toLowerCase();
        let nombreCliente = paso.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(paso);
        }
      }
      this.paso3 = arrayP1;
    }
  }
  buscadorsin_pago(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if (texto.length === 0) {
      this.tabdata();
    } else {
      for (let noPagos of this.no_pagos) {
        let codigo = noPagos.codigo.toLowerCase();
        let nombreCliente = noPagos.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(noPagos);
        }
      }
      this.no_pagos = arrayP1;
    }
  }
  buscadorpago(event) {
    const texto = event.target.value.toLowerCase();
    const arrayP1 = [];
    if (texto.length === 0) {
      this.tabdata();
    } else {
      for (let noPagos of this.pagados) {
        let codigo = noPagos.codigo.toLowerCase();
        let nombreCliente = noPagos.nombreCliente.toLowerCase();
        if (codigo.indexOf(texto) !== -1 || nombreCliente.indexOf(texto) !== -1) {
          arrayP1.push(noPagos);
        }
      }
      this.pagados = arrayP1;
    }
  }

  clickTabPaso(paso){
    if(paso == 1){
      const btn = document.getElementById('tab-pendientes');
      btn.click();
    }else if(paso == 2){
      const btn = document.getElementById('tab-proceso');
      btn.click();
    }else if(paso == 3){
      const btn = document.getElementById('tab-finalizado')
      btn.click();
    }else if(paso == 4){
      const btn = document.getElementById('tab-nopago')
      btn.click();
    }else if(paso == 5){
      const btn = document.getElementById('tab-pago')
      btn.click();
    }
    
  }
  nuevaSolicitudTrue(){
    this.nuevaSolicitud = true;
  }
}
