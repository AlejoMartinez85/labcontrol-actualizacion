import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';
import swal from 'sweetalert2';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Cliente } from '../../../models/cliente';
import { IOption } from 'ng-select';
import { Subscription } from 'rxjs/Subscription';
import { Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import { Invitacion } from '../../../models/invitacion';
import { InvitacionService } from '../../../services/invitacion/invitacion.service';
@Component({
  selector: 'app-laboratorio-index',
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

  form: FormGroup;
  item: any;
  items: any;
  columns: any[];
  autocompleteItems: string[];
  user: any;
  cliente: any;
  indicadores: any;
  indclientes: any;


  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private itemService: ClienteService,
    public http: Jsonp,
    private invitacionService: InvitacionService) {
    this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.cargardatos();


    this.autocompleteItems = ['Alabama', 'Wyoming', 'Henry Die', 'John Doe'];
  }

  ngOnInit() {
    this.item = new Invitacion();

    this.form = this.formBuilder.group({
      emails: [null, Validators.required],
      descripcion: [],
    });


  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  closeMyModalbtn(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  guardar(event) {
    this.item.tercero_id = this.user.tercero._id;
    this.item.tipo = 2;
    this.invitacionService.add(this.item).subscribe((value: any) => {

      this.closeMyModalbtn(event);
      this.cargardatos();
      if (value.nuevo) {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'Laboratorio invitado con exito', type: 'success' });
      } else {
        this.notificationService.addNotify({ title: 'Alerta', msg: 'El laboratorio ya existe', type: 'success' });
      }

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargardatos() {
    this.itemService.getById(this.user.tercero._id).subscribe((value: any) => {
      this.cliente = value.clientes;
      this.indicadores = value.indicadores;
      this.indclientes = value.indclientes;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }

  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el cliente?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.eliminarItem(item);
      }

    );
  }
  eliminarItem(item) {
    this.itemService.delete(item._id, item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Cliente eliminado con exito', type: 'success' });
      item.edit = false;
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
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

        this.actualizarItem(item);
      }

    );
  }
  actualizarItem(item) {

    this.itemService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Cliente actualizado con exito', type: 'success' });
      item.edit = false;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }

}
