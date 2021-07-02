import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';
import { ParametroService } from '../../../services/parametro/parametro.service';
import swal from 'sweetalert2';
import { InvitacionService } from '../../../services/invitacion/invitacion.service';

@Component({
  selector: 'app-invitacion-index',
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
  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private itemService: InvitacionService) {
    this.columns = [{ name: 'Nombre' },
    { name: 'Metodo', prop: 'tecnica_analitica' },
    { name: 'Tecnica analítica', prop: 'tecnica_analitica' },
    { name: 'Unidad', prop: 'unidad' },
    { name: 'valor_unit', prop: 'valor_unit' },
    { name: 'descripcion', prop: 'descripcion' }];
    this.cargardatos();

  }

  ngOnInit() {
    this.item = new Parametro();
    this.form = this.formBuilder.group({
      nombre: [null, Validators.required],
      metodo: [null, Validators.required],
      tecnica_analitica: [null, Validators.required],
      unidad: [null, Validators.required],
      valor_unit: [null, Validators.required],
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

    this.itemService.add(this.item).subscribe((value) => {

      this.closeMyModalbtn(event);
      this.cargardatos();
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro almacenado con exito', type: 'success' });
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargardatos() {
    this.itemService.get(1).subscribe((value: any) => {
      this.items = value.invitacion;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  celiminarItem(item) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar el parametro?',
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
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro eliminado con exito', type: 'success' });
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
      text: '¿ Realmente deseas aprobar la invitación?',
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
    item.aprobado = true;
    this.itemService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Invitación actualizado con exito', type: 'success' });

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }
}
