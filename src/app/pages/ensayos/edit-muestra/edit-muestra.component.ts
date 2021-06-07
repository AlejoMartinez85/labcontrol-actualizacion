import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MuestraService } from '../../../services/muestra/muestra.service';
import { Ensayo } from '../../../models/ensayo';
import swal from 'sweetalert2';
@Component({
  selector: 'app-edit-muestra',
  templateUrl: './edit-muestra.component.html',
  styleUrls: ['./edit-muestra.component.scss']
})
export class EditMuestraComponent implements OnInit {
  $identificador;
  formaMuestras: FormGroup;
  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: 'Authorization',
    authToken: 'Bearer ' + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
  });
  muestraFinal = {
    imagen_perfil: '',
    codigo: '',
    descripcion: '',
    fecha_ingreso: Date,
    observaciones: ''
  };
  imagePath = './assets/images/unnamed.png';
  archivosMuestras = [];
  archivosMuestrasbd = [];
  Muestra = [];
  ensayo: any;
  apiurl: string;
  constructor(private router: ActivatedRoute, private muestraService: MuestraService,
    private routernavegate: Router) {
    this.$identificador = this.router.snapshot.paramMap.get('id');
    this.ensayo = new Ensayo();
    this.apiurl = environment.apiUrl;
  }
  ngOnInit() {
    this.formaMuestras = new FormGroup({
      codigo: new FormControl(''),
      descripcion: new FormControl(''),
      fecha_ingreso: new FormControl(new Date().toISOString().split('T')[0]),
      observaciones: new FormControl(''),
      imagen_perfil: new FormControl(''),
      _id: new FormControl(''),
    });
    this.uploaderMethod();
    this.cargaMuestra(this.$identificador);
  }
  uploaderMethod() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.imagePath = `${this.apiurl}upload/files_client/${JSON.parse(response).file.filename}`;
    };
  }
  editarForm() {
    this.formaMuestras.value.imagen_perfil = this.imagePath;
    this.muestraService.update(this.formaMuestras.value).subscribe((value) => {
      if (value.success) {
        alert(`La muestra ${value.muertaEdit.codigo}, Fue actualizada con Éxito`);
        this.routernavegate.navigate(['/ensayos/recepcionEnsayo']);
      } else {
        alert(value.message);
      }
    });
  }
  cargaMuestra(id) {
    this.muestraService.getById(id).subscribe(muestra => {
      if (muestra.success) {
        this.Muestra = muestra.muestra;
        this.imagePath = this.Muestra['imagen_perfil'];
        this.archivosMuestrasbd = this.Muestra['archivos_adjuntos'];
        this.formaMuestras.setValue({
          codigo: this.Muestra['codigo'],
          descripcion: this.Muestra['descripcion'],
          fecha_ingreso: this.Muestra['fecha_ingreso'],
          observaciones: this.Muestra['observaciones'],
          imagen_perfil: this.Muestra['imagen_perfil'],
          _id: this.$identificador
        });
      }
    });
  }
  uploadfile1(value) {
    this.archivosMuestras = [];
    this.archivosMuestras.push(value);
  }
  GuardarArchivos() {
    if (this.archivosMuestras[0].length > 0) {
      this.archivosMuestras[0].forEach(element => {
        const url = `${this.apiurl}upload/files_client/${element.filename}?name=${element.originalname}`;
        const nombre = element.originalname;
        this.muestraService.updatearchivos({ url: url, nombre: nombre }, this.$identificador)
          .subscribe(resp => { });
        this.cargaMuestra(this.$identificador);
        this.uploaderMethod();
        location.reload();
      });
    }
  }
  eliminarArchivo(id){
    const archivoEliminar = {
      idArchivo: id
    };
    this.muestraService.deleteArchivo(this.$identificador, archivoEliminar).subscribe(resp => {
      if(resp.success){
        this.cargaMuestra(this.$identificador);
      }
    });
  }
  eliminarMuestra(id) {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas eliminar la Muestra?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {
      this.muestraService.delete(id).subscribe(resp => {
        this.routernavegate.navigate(['/ensayos/recepcionEnsayo']);
      });
    }
    );
  }
}
