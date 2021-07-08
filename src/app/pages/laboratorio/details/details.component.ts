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
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Cliente } from '../../../models/cliente';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss',
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
export class DetailsComponent implements OnInit {


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
  editProfile = true;
  editProfileIcon = 'icofont-edit';
  user: any;
  cliente: any;
  item: any;

  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private muestraService: MuestraService,
    private clienteService: ClienteService,
    private route: ActivatedRoute, ) {
    this.ensayo = new Ensayo();

  }

  ngOnInit() {

    this.item = new Cliente();
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      nombre_contacto: [null, Validators.required],
      email_contacto: [null, Validators.required],
      nid: [],
      tid: [],
      direccion: [],
      ciudad: [],
      departamento: [],
      telefonos: [],
      descripcion: [],
    });
    const $invite = this.route.snapshot.queryParamMap.get('invite');
    if ($invite != undefined) {

    }
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.tabdata();
    this.cargardatos();
  }

  openMyModal(event) {
    this.ensayo = new Ensayo();
    this.ensayo.estado = 'Cotización';
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    document.querySelector('#effect-3').classList.remove('md-show');

  }

  editarEnsayo(ensayo) {

    this.ensayoservice.getById(ensayo._id).subscribe((value: any) => {
      this.openMyModal('effect-3');
      this.ensayo = value.ensayos;
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format('YYYY-MM-DD');
      this.ensayo.fEnsayo = this.ensayo.fEnsayo == undefined ? undefined : moment(this.ensayo.fEnsayo).format('YYYY-MM-DD');
      this.ensayo.fEntrega = this.ensayo.fEntrega == undefined ? undefined : moment(this.ensayo.fEntrega).format('YYYY-MM-DD');
      this.ensayo.fFacturado = this.ensayo.fFacturado == undefined ? undefined : moment(this.ensayo.fFacturado).format('YYYY-MM-DD');
      this.ensayo.fVencimiento = this.ensayo.fVencimiento == undefined ? undefined : moment(this.ensayo.fVencimiento).format('YYYY-MM-DD');
      this.ensayo.fpago = this.ensayo.fpago == undefined ? undefined : moment(this.ensayo.fpago).format('YYYY-MM-DD');

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargardatos() {
    const $id = this.route.snapshot.paramMap.get('id');
    this.clienteService.getById($id).subscribe((value: any) => {
      this.cliente = value.clientes;
      this.cliente.tid = this.cliente.tid == undefined ? '' : this.cliente.tid;
      this.indicadores = value.indicadores;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargarEnsayos(estado) {
    const $id = this.route.snapshot.paramMap.get('id');
    this.ensayoservice.getClienteLab($id, 1, estado).subscribe((value: any) => {

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
  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
  }
  cactualizarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas actualizar el cliente?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.actualizarItem(this.cliente);
      }

    );
  }
  actualizarItem(item) {

    this.clienteService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Cliente actualizado con exito', type: 'success' });
      item.edit = false;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }


}
