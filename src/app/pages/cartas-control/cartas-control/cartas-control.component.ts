import { Component, OnInit } from '@angular/core';
import { ParametroService } from '../../../services/parametro/parametro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CartasControlService } from '../../../services/cartas-control/cartas-control.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Permisos } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
@Component({
  selector: 'app-cartas-control',
  templateUrl: './cartas-control.component.html',
  styleUrls: ['./cartas-control.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss']
})
export class CartasControlComponent implements OnInit {

  parametros;
  formCrearCarta: FormGroup;
  fecha: Date;
  cartasControl;
  cantidad: number;
  user: any;
  desde = 0;
  estadopag = false;
  continue = true;
  columns;
  permisosLocal = {
    editar: false,
    eliminar: false,
    crear: false,
    ver: false,
  };
  Permisos: Permisos;
  constructor(
    private notificationService: NotificationService,
    private parametroService: ParametroService,
    private cartasControlService: CartasControlService,
    private router: Router,
    private rolesPermisosServices: RolesPermisosService
    ) {
      this.Permisos = new Permisos();

      this.columns = [
        { name: 'Nombre', prop: 'Nombre' },
        { name: 'Estado', prop: 'Estado' },
        { name: 'Método', prop: 'Méthodo' },
        { name: 'último ingreso', prop: 'último ingreso' },
        { name: 'Inicio Periodo', prop: 'Inicio Periodo' },
        { name: 'Fin periodo', prop: 'Fin periodo' },
        { name: 'Nro. Datos', prop: 'Nro. Datos' },
        { name: 'Acciones', prop: 'Acciones' },
        { name: 'Unidad', prop: 'Unidad' }
      ];
   }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.formCrearCarta = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      unidad: new FormControl(null, Validators.required),
      methodoEnsallo: new FormControl(null, Validators.required),
      observaciones: new FormControl(null, Validators.required),
      tipoCarta: new FormControl(null, Validators.required),
      finPeriodo: new FormControl(null, Validators.required),
      dias: new FormControl(null, Validators.required),
      rangoSleccionado: new FormControl(null, Validators.required),
    });
    this.parametroService.get(1).subscribe(parametros => this.parametros = parametros['parametros']);
    this.cargarCartas(this.desde);
    if ( localStorage.getItem('permisos')) {
      this.Permisos = JSON.parse(localStorage.getItem('permisos'));
      this.permisosLocal = this.Permisos.Cartas[0];
    } else {
      this.cargarPermisos(this.user.rol);
    }
  }
  cargarPermisos(id) {
    try {
      this.rolesPermisosServices.getPermisos(id).subscribe( (resp: any) => {

        if (resp.success) {
          this.Permisos = resp.permisos;
          this.permisosLocal = this.Permisos.Cartas[0];
          console.log(this.permisosLocal);
        } else {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
        }

      });
    } catch (e) {
      this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
    }
  }
  EditarCarta(row) {
    const carta = {
      nombre: row.nombre,
      unidad: row.unidad,
    }
    this.cartasControlService.updateTable(row._id, carta).subscribe(element => {
      this.cargarCartas(0);
    })
    console.log(row);
  }
  openModal(element){
    document.querySelector('#' + element).classList.add('md-show');
  }
  close(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }

  /*
  * Cartas 
  */
 cargarCartas(desde){
  this.desde = desde;
  if(desde < 0) {
    this.desde = 0;
  }
  if (this.desde !== 0) {
    this.estadopag = true;
  }
  this.cartasControlService.getAll(desde).subscribe(cartas =>{
    this.cartasControl = cartas;
    this.cantidad = cartas.length;
    if(this.cartasControl.length < 5){
      this.continue = false;
    }
  });
 }
  agregarCarta() {
    this.fecha = new Date();
    const dias = this.formCrearCarta.value.dias * parseInt(this.formCrearCarta.value.rangoSleccionado)
    this.fecha.setDate(this.fecha.getDate() + dias);

    const cartas = {
      nombre: this.formCrearCarta.value.nombre,
      unidad: this.formCrearCarta.value.unidad,
      methodoEnsallo: this.formCrearCarta.value.methodoEnsallo,
      observaciones: this.formCrearCarta.value.observaciones,
      tipoCarta: this.formCrearCarta.value.tipoCarta,
      finPeriodo: this.fecha,
      dias: this.formCrearCarta.value.dias,
      rangoSleccionado: parseInt(this.formCrearCarta.value.rangoSleccionado),
      tercero: this.user.tercero._id,
      usuario: this.user._id
    };
    this.cartasControlService.add(cartas).subscribe(carta =>{
      this.router.navigate(['/config/cartas-control/ver',  carta._id ]);
    });

  }
  eliminarCard(carta){
    swal({
      title: 'Alerta!',
      text: `¿¿ Realmente deseas eliminar la Carta: ${carta.nombre}?`,
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
        this.cartasControlService.delete(carta._id).subscribe( cartaEliminada => {
          this.notificationService.addNotify(
            { title: 'Carta',
              msg:  `La carta ${cartaEliminada.nombre} Se ha eliminado correctamente`,
              type: 'sucess'
            }
          );
          this.cargarCartas(this.desde);
        });
    });
  }
  buscarCartas(event) {
    this.cartasControlService.getBuscarCartasControl(event.target.value).subscribe(resp => {
      if (resp.success) {
        this.cartasControl = resp.cartas;
      }
    })
  }
}
