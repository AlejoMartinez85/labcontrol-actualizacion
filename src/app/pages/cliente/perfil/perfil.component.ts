import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { NotificationService } from '../../../shared/notification';
import swal from 'sweetalert2';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { CambiarperfilService } from '../../../services/cambiarperfil/cambiarperfil.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Cliente } from '../../../models/cliente';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss',
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
export class PerfilComponent implements OnInit {


  uploader: FileUploader = new FileUploader({
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
  cliente: any;
  user: any;
  apiurl: string;
  newpassword: string;
  rpassword: string;
  myForm: FormGroup;
  isValidFormSubmitted: boolean;
  form: FormGroup;
  constructor(private clienteService: ClienteService,
    private notificationService: NotificationService,
    private cambiarPerfil: CambiarperfilService,
    private formBuilder: FormBuilder) {

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

    this.cliente= new Cliente();

    this.cargardatos();
  }

  ngOnInit() {
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
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
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
    this.clienteService.getById(this.user.tercero._id).subscribe((value: any) => {
      this.cliente = value.clientes;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
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
        this.cliente.cambiopassword = false;
        this.actualizarItem(this.cliente);
    }
    );
  }
  actualizarItem(item) {

    this.clienteService.update(item).subscribe((value) => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Uusario actualizado con exito', type: 'success' });
      item.edit = false;

    }, err => {
      this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
    });


  }

  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
    let file = JSON.parse(response).file;
    this.cliente.imagen = file.filename;
    this.actualizarItem(this.cliente);
  }




}
