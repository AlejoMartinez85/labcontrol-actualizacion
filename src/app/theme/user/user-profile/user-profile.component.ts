import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { NotificationService } from '../../../shared/notification';
import swal from 'sweetalert2';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { CambiarperfilService } from '../../../services/cambiarperfil/cambiarperfil.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AngularCropperjsComponent, ImageCropperResult } from 'angular-cropperjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Usuario } from '../../../models/usuario';
import { Rol } from '../../../models/Rol';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
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
export class UserProfileComponent implements OnInit {

  uploader: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,

  });
  uploaderfirma: FileUploader = new FileUploader({
    url: environment.apiUrl + 'upload',
    authTokenHeader: "Authorization",
    authToken: "Bearer " + localStorage.getItem('access_token'),
    isHTML5: true,
    autoUpload: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  editProfile = true;
  editProfileIcon = 'icofont-edit';

  editAbout = true;
  editAboutIcon = 'icofont-edit';

  public editor;
  public editorContent: string;

  public data: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  profitChartOption: any;

  rowsContact = [];
  loadingIndicator = true;
  reorderable = true;
  usuario: any;
  user: any;
  apiurl: string;
  newpassword: string;
  rpassword: string;
  myForm: FormGroup;
  isValidFormSubmitted: boolean;
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  config = { zoomable: true, movable: true, scalable: true };
  imageUrl = "";

  resultImage: any;
  resultResult: any;
  noshow: boolean;
  Rol: Rol;
  Roles: Rol;
  constructor(private userService: UsuariosService,
    private notificationService: NotificationService,
    private cambiarPerfil: CambiarperfilService,
    private sanitizer: DomSanitizer,
    private rolesPermisosServices: RolesPermisosService) {
    this.Roles = new Rol();
    this.Rol = new Rol();
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    this.fetchContactData((data) => {
      this.rowsContact = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
    const password = new FormControl('', Validators.required);
    const rpassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);
    this.myForm = new FormGroup({
      password: password,
      rpassword: rpassword
    });
    this.usuario = new Usuario();

    this.cargardatos();
    this.cargaRoles();
  }

  ngOnInit() {
    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        name: item.file.name,
        type: item.file.type
      };
    };
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.uploaderfirma.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploaderfirma.onSuccessItem = (item, response, status, headers) => this.onSuccessItemFirma(item, response, status, headers);
    this.apiurl = environment.apiUrl;
    setTimeout(() => {
      this.editorContent = 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising ';
      this.editorContent += 'pain was born and I will give you a complete account of the system, and expound the actual ';
      this.editorContent += 'teachings of the great explorer of the truth, the master-builder of human happiness. No one ';
      this.editorContent += 'rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who ';
      this.editorContent += 'do not know how to pursue pleasure rationally encounter consequences that are extremely ';
      this.editorContent += 'painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, ';
      this.editorContent += 'because it is pain, but because occasionally circumstances occur in which toil and pain can ';
      this.editorContent += 'procure him some great pleasure. To take a trivial example, which of us ever undertakes ';
      this.editorContent += 'laborious physical exercise, except to obtain some advantage from it? But who has any right ';
      this.editorContent += 'to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, ';
      this.editorContent += 'or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce ';
      this.editorContent += 'with righteous indignation and dislike men who are so beguiled and demoralized by the charms ';
      this.editorContent += 'of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and ';
      this.editorContent += 'trouble that are bound to ensue; and equal blame belongs to those who fail in their duty ';
      this.editorContent += 'through weakness of will, which is the same as saying through shrinking from toil and pain. ';
      this.editorContent += 'These cases are perfectly simple and easy to distinguish. In a free hour, when our power of ';
      this.editorContent += 'choice is untrammelled and when nothing prevents our being able To Do what we like best, ';
      this.editorContent += 'every pleasure is to be welcomed and every pain avoided. But in certain circumstances and ';
      this.editorContent += 'owing to the claims of duty or the obligations of business it will frequently occur that ';
      this.editorContent += 'pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds';
      this.editorContent += 'in these matters to this principle of selection: he rejects pleasures to secure other ';
      this.editorContent += 'greater pleasures, or else he endures pains to avoid worse pain.';
    }, 2800);

    setTimeout(() => {
      this.profitChartOption = {
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const date = new Date(params.value[0]);
            let data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ';
            data += date.getHours() + ':' + date.getMinutes();
            return data + '<br/>' + params.value[1] + ', ' + params.value[2];
          },
          responsive: true
        },
        dataZoom: {
          show: true,
          start: 70
        },
        legend: {
          data: ['Profit']
        },
        grid: {
          y2: 80
        },
        xAxis: [{
          type: 'time',
          splitNumber: 10
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: 'Profit',
          type: 'line',
          showAllSymbol: true,
          symbolSize: function (value) {
            return Math.round(value[2] / 10) + 2;
          },
          data: (function () {
            const d: any = [];
            let len = 0;
            const now = new Date();
            while (len++ < 200) {
              const random1: any = (Math.random() * 30).toFixed(2);
              const random2: any = (Math.random() * 100).toFixed(2);
              d.push([new Date(2014, 9, 1, 0, len * 10000), random1 - 0, random2 - 0]);
            }
            return d;
          })()
        }]
      };
    }, 1);
  }

  fetchContactData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/data.json');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
  }

  toggleEditAbout() {
    this.editAboutIcon = (this.editAboutIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editAbout = !this.editAbout;
  }

  cargardatos() {
    this.userService.getById(this.user.id).subscribe((value) => {
      this.usuario = value.user;
      this.cargarRol(this.usuario.rol);
      this.imageUrl = this.apiurl + 'upload/files_client/' + this.usuario.firmaOriginal;
      this.noshow = true;
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });
  }
  cargarRol(id) {
    this.rolesPermisosServices.getIdRole(id).subscribe( (resp: any) => {
      if (resp.success) {
        this.Rol = resp.role;
      } else {
        this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
      }
    });
  }
  cargaRoles() {
    this.Roles = new Rol();
    this.rolesPermisosServices.getRole().subscribe( (resp: any) => {
      if (resp.success) {
        if (resp.cantidad === 0) {
          this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'info' });
        } else {
          this.Roles = resp.roles;
        }
      }
    });
  }
  cactualizarItem() {
    swal({
      title: 'Alerta!',
      text: '¿ Realmente deseas actualizar sus datos?',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No',
      useRejections: true           // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then((result) => {

        this.usuario.cambiopassword = false;
        this.actualizarItem(this.usuario);
      }

    );
  }
  actualizarItem(item) {
    this.userService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Uusario actualizado con exito', type: 'success' });
      item.edit = false;
      this.noshow = true;
      this.cambiarPerfil.nextMessage(item);
      document.getElementById('edit-btn').click();
    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }

  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    let file = JSON.parse(response).file;
    this.usuario.imagen = file.filename;
    this.actualizarItem(this.usuario);
  }
  onSuccessItemFirma(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    let file = JSON.parse(response).file;
    this.usuario.firmaOriginal = '';
    this.usuario.firmaOriginal = file.filename;
    this.imageUrl = this.apiurl + 'upload/files_client/' + this.usuario.firmaOriginal;
    this.noshow = false;
    this.actualizarItem(this.usuario);

  }

  cambiarpassword() {
    this.isValidFormSubmitted = false;
    if (this.myForm.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    this.usuario.password = this.newpassword;
    this.usuario.cambiopassword = true;
    this.actualizarItem(this.usuario);
  }
  CropMe() {
    // this.resultResult = this.angularCropper.imageUrl;
    console.log("Hello");
    // this.resultImage = this.angularCropper.cropper.getCroppedCanvas()
    // console.log(this.resultImage);
    this.angularCropper.exportCanvas();

  }
  zoomIn() {
    this.angularCropper.cropper.zoom(0.1);

  }
  zoomOut() {
    this.angularCropper.cropper.zoom(-0.1);
  }
  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  resultImageFun(event: ImageCropperResult) {
    let urlCreator = window.URL;
    this.usuario.firma = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    this.usuario.firmaWidth = event.cropData.width;
    this.usuario.firmaHeight = event.cropData.height;

  }

  checkstatus(event: any) {
    console.log(event.blob);
    if (event.blob === undefined) {
      return;
    }
    // this.resultResult = event.blob;
    let urlCreator = window.URL;
    this.usuario.firma = this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(new Blob(event.blob)));
  }

}
