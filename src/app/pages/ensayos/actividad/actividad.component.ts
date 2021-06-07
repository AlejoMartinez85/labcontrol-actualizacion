import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ComentarioService } from '../../../services/comentario/comentario.service';
import { NotificationService } from '../../../shared/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comentario } from '../../../models/comentario';
import { ActividadService } from '../../../services/actividad/actividad.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class ActividadComponent implements OnInit {

  form: FormGroup;
  actividades: any;
  comentario: Comentario;
  user: any;
  apiurl: string;
  @Input() tipoComentario: string = '';
  muestrasForEnsayo = [];
  cantidadListado = 0;
  estado = false;
  continue = true;
  constructor(
    private actividadService: ActividadService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  ) {this.apiurl = environment.apiUrl; }

  ngOnInit() {
    this.cantidadListado = 0;
    this.user = JSON.parse(localStorage.getItem('userInfo'));
      this.comentario = new Comentario();
      this.form = this.formBuilder.group({
      comentario: [null, Validators.required],
    });
    this.CargarComentarios(this.cantidadListado);
  }
  
  CargarComentarios(desde) {
    this.cantidadListado = desde;
    if(desde < 0) {
      this.cantidadListado = 0;
    }
    if (this.cantidadListado !== 0) {
      this.estado = true;
    }
    this.actividadService.get(this.tipoComentario,this.cantidadListado).subscribe((value) => {
      this.actividades = value.ensayos;
      if(this.actividades.length < 5){
        this.continue = false;
      }
      // console.log(this.actividades)
      if(this.tipoComentario === 'Muestras') {
        console.log(this.actividades);
        this.actividades.forEach(element => {
          if (element.ensayo !== null) {
            element.ensayo.muestras.forEach(element => {
              this.muestrasForEnsayo.push(element);
            });
          }
        });
      }
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  buscaActividad(event){
    if ( event.target.value === '') {
      return;
    }
    const resultadosBusqueda = [];
    this.actividadService.busquedaActividad(event.target.value).subscribe( resp => {
      if (resp.success) {
        resp.actividades.forEach((element, index) => {
          if (resp.actividades[index].tipoComentario === this.tipoComentario) {
            resultadosBusqueda.push(element);
          }
        });
        this.actividades = resultadosBusqueda;
      }
    });
  }

}
