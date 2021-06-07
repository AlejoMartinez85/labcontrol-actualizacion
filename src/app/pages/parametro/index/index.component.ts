import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../shared/notification';
import { animate, style, transition, trigger } from '@angular/animations';
import { Parametro } from '../../../models/parametro';
import { ParametroService } from '../../../services/parametro/parametro.service';
import swal from 'sweetalert2';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
import { RolesPermisosService } from '../../../services/roles/roles-permisos.service';
import { Permisos } from '../../../models/Rol';

@Component({
	selector: 'app-index',
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
	fileName = 'ExcelSheet.xlsx';
	indice;
	form: FormGroup;
	formconfig: FormGroup;
	formconfigEdit: FormGroup;
	item: any;
	items: any;
	columns: any[];
	user: any;
	configuraciones = [];
	crear = true;
	edit = false;
	campo1 = false;
	campo2 = false;
	campo3 = false;
	campo4 = false;
	campo5 = false;
	variableTecnica = false;
	nombre = "data 1";
	datoCopypaste = [];
	displayedColumns: string[];
	cabeceras = ['Código', 'Nombre', 'Unidades', 'Metodo', 'tecnica Analitica', 'Valor ensayo'];
	btnActivo = false;
	permisosLocal = {
		editar: false,
		eliminar: false,
		crear: false,
		ver: false,
	};
	Permisos: Permisos;
	constructor(private notificationService: NotificationService,
		private formBuilder: FormBuilder,
		private parametroService: ParametroService,
		private rolesPermisosServices: RolesPermisosService) {
		this.columns = [
			{ name: 'Código', prop: 'Código' },
			{ name: 'Nombre', prop: 'Nombre' },
			{ name: 'Unidades', prop: 'Unidades' },
			{ name: 'Método', prop: 'Método' },
			{ name: 'Técnica analítica', prop: 'Técnica analítica' },
			{ name: 'Valor Ensayo', prop: 'Valor Ensayo' }
		];
		this.cargardatos();
		this.user = JSON.parse(localStorage.getItem('userInfo'));
		this.Permisos = new Permisos();
		if ( localStorage.getItem('permisos')) {
			this.Permisos = JSON.parse(localStorage.getItem('permisos'));
			this.permisosLocal = this.Permisos.Paramertros[0];
		  } else {
			this.cargarPermisos(this.user.rol);
		  }
	}

	ngOnInit() {
		this.parametroService.getUltimo(1).subscribe(element => {
			console.log(parseInt(element.pos.index) + 1)
			this.indice = parseInt(element.pos.index) + 1;
		});
		this.item = new Parametro();
		this.form = this.formBuilder.group({
			codigo: [null, Validators.required],
			nombre: [null, Validators.required],
			variable1anexo: [null],
			variable2anexo: [null],
			variable3anexo: [null],
			variable4anexo: [null],
			variable5anexo: [null],
			metodo: [null],
			tecnica_analitica: [null],
			unidad: [null, Validators.required],
			valor_unit: [null],
			descripcion: [],
		});

		this.formconfig = new FormGroup({
			variable1: new FormControl(false),
			variable2: new FormControl(false),
			variable3: new FormControl(false),
			variable4: new FormControl(false),
			variable5: new FormControl(false),
			variableTecnica: new FormControl(false),
			titulo1: new FormControl(''),
			titulo2: new FormControl(''),
			titulo3: new FormControl(''),
			titulo4: new FormControl(''),
			titulo5: new FormControl(''),
			tercero: new FormControl(this.user.tercero._id)
		});
		this.formconfigEdit = new FormGroup({
			variable1: new FormControl(false),
			variable2: new FormControl(false),
			variable3: new FormControl(false),
			variable4: new FormControl(false),
			variable5: new FormControl(false),
			variableTecnica: new FormControl(false),
			titulo1: new FormControl(''),
			titulo2: new FormControl(''),
			titulo3: new FormControl(''),
			titulo4: new FormControl(''),
			titulo5: new FormControl(''),
		});
		this.getParametros();
	}
	cargarPermisos(id) {
		try {
			this.rolesPermisosServices.getPermisos(id).subscribe((resp: any) => {

				if (resp.success) {
					this.Permisos = resp.permisos;
					this.permisosLocal = this.Permisos.Paramertros[0];
					console.log(this.Permisos)
					console.log(this.permisosLocal)
				} else {
					this.notificationService.addNotify({ title: 'Roles', msg: resp.message, type: 'error' });
				}

			});
		} catch (e) {
			this.notificationService.addNotify({ title: 'Roles', msg: e.message, type: 'error' });
		}
	}
	openMyModal(event) {
		document.querySelector('#' + event).classList.add('md-show');
	}
	closeModalMasivo(event) {
		document.querySelector('#' + event).classList.remove('md-show');
	}
	closeMyModal(event) {
		((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
	}
	closeMyModalbtn(event) {
		((event.target.parentElement.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
	}
	guardar(event) {
		this.parametroService.getUltimo(1).subscribe(valor => {
			if (valor.success) {
				console.log(valor.pos.index);
				this.item.index = parseInt(valor.pos.index) + 1;
			}
		});
		this.item.tercero = this.user.tercero._id;
		this.parametroService.add(this.item).subscribe((value) => {

			this.closeMyModalbtn(event);
			this.cargardatos();
			this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro almacenado con exito', type: 'success' });
		}, err => {
			this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
		});
	}
	cargardatos() {
		this.parametroService.get(1).subscribe((value) => {
			this.items = value.parametros;
			console.log(this.items)
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
		this.parametroService.delete(item._id, item).subscribe((value) => {
			this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro eliminado con exito', type: 'success' });
			item.edit = false;
			this.cargardatos();
		}, err => {
			this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
		});
	}
	cactualizarItem(item) {
		swal({
			title: 'Alerta!',
			text: '¿ Realmente deseas actualizar el parametro?',
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
		console.log(item)
		this.parametroService.update(item).subscribe((value) => {
			console.log(value)
			location.reload();
			this.notificationService.addNotify({ title: 'Alerta', msg: 'Parametro actualizado con exito', type: 'success' });
			item.edit = false;
		}, err => {
			location.reload();
			this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
		});


	}
	buscarParametros(event) {
		this.parametroService.getBuscarParametros(event.target.value).subscribe(parametros => {
			if (parametros.success) {
				this.items = parametros.parametros;
			} else {
				return;
			}
		})
	}
	guardarConfiguracion() {
		this.parametroService.createConfigParametros(this.formconfig.value).subscribe(respuesta => { });
		document.querySelector('#configuracion-parametros').classList.remove('md-show');
	}
	editarConfiguracion() {
		this.parametroService.editarConfigParametros(this.formconfigEdit.value, this.configuraciones[0]._id).subscribe(resp => {
			document.querySelector('#configuracion-parametros-edit').classList.remove('md-show');
			this.getParametros();
		});
	}
	getParametros() {
		this.columns = [
			{ name: 'Código', prop: 'Código' },
			{ name: 'Nombre', prop: 'Nombre' },
			{ name: 'Unidades', prop: 'Unidades' },
			{ name: 'Método', prop: 'Método' },
			{ name: 'Técnica analítica', prop: 'Técnica analítica' },
			{ name: 'Valor Ensayo', prop: 'Valor Ensayo' }
		];
		this.campo1 = false;
		this.campo2 = false;
		this.campo3 = false;
		this.campo4 = false;
		this.campo5 = false;
		this.variableTecnica = false;
		this.configuraciones = [];
		this.parametroService.getConfigParametros(1).subscribe(valores => {
			if (valores.success) {
				if (valores.configuracion.length > 0) {
					this.configuraciones = valores.configuracion;
					this.crear = false;
					this.edit = true;
					if (this.configuraciones[0].variable1) {
						this.campo1 = true;
						this.columns.push({ name: this.configuraciones[0]['titulo1'], prop: this.configuraciones[0]['titulo1'] });
					} else {
						this.columns.push({ name: '', prop: '' });
					}
					if (this.configuraciones[0].variable2) {
						this.campo2 = true;
						this.columns.push({ name: this.configuraciones[0]['titulo2'], prop: this.configuraciones[0]['titulo2'] });
					} else {
						this.columns.push({ name: '', prop: '' });
					}
					if (this.configuraciones[0].variable3) {
						this.campo3 = true;
						this.columns.push({ name: this.configuraciones[0]['titulo3'], prop: this.configuraciones[0]['titulo3'] });
					} else {
						this.columns.push({ name: '', prop: '' });
					}
					if (this.configuraciones[0].variable4) {
						this.campo4 = true;
						this.columns.push({ name: this.configuraciones[0]['titulo4'], prop: this.configuraciones[0]['titulo4'] });
					} else {
						this.columns.push({ name: '', prop: '' });
					}
					if (this.configuraciones[0].variable5) {
						this.campo5 = true;
						this.columns.push({ name: this.configuraciones[0]['titulo5'], prop: this.configuraciones[0]['titulo5'] });
					} else {
						this.columns.push({ name: '', prop: '' });
					}
					if (this.configuraciones[0].variableTecnica) {
						this.variableTecnica = true;
					}
					this.formconfigEdit.setValue({
						variable1: this.campo1,
						variable2: this.campo2,
						variable3: this.campo3,
						variable4: this.campo4,
						variable5: this.campo5,
						variableTecnica: this.variableTecnica,
						titulo1: this.configuraciones[0]['titulo1'],
						titulo2: this.configuraciones[0]['titulo2'],
						titulo3: this.configuraciones[0]['titulo3'],
						titulo4: this.configuraciones[0]['titulo4'],
						titulo5: this.configuraciones[0]['titulo5'],
					});
				}
			}
		})
	}
	copypaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		const pastedText = clipboardData.getData('text');
		const row_data = pastedText.split('\n');
		this.datoCopypaste = [];
		this.displayedColumns = row_data[0].split('\t');
		row_data.forEach(row_data => {
			this.datoCopypaste.push(row_data.split('\t'));
		});
		this.btnActivo = true;
	}
	formMasivo() {
		this.item = new Parametro();
		this.item.tercero = this.user.tercero._id;
		for (let i = 0; i <= this.datoCopypaste.length - 1; i++) {
			this.item.index = this.indice + i;
			this.item.codigo = this.datoCopypaste[i][0];
			this.item.nombre = this.datoCopypaste[i][1];
			this.item.unidad = this.datoCopypaste[i][2];
			this.item.metodo = this.datoCopypaste[i][3];
			this.item.tecnica_analitica = this.datoCopypaste[i][4];
			this.item.valor_unit = parseInt(this.datoCopypaste[i][5]);
			this.parametroService.add(this.item).subscribe((value) => {
				this.cargardatos();
			});
		}

		this.closeModalMasivo('usuarios-masivos');
	}
	editar(id) {
		const campos = [];
		this.datoCopypaste[id].forEach((element, index) => {
			campos.push(document.getElementById('campo-' + index + '-' + id)['value']);
		});
		this.datoCopypaste.splice(id, 1);
		this.datoCopypaste.push(campos);
	}
	eliminar(id) {
		this.datoCopypaste.splice(id, 1);
	}


	exportexcel(): void {
		let codigo: String = 'Actual';
		/* table id is passed over here */

		codigo = 'Datos parametros';
		this.fileName = codigo + '.xlsx';
		let element = document.getElementById('excel-table');
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: false });
		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		/* save to file */
		XLSX.writeFile(wb, this.fileName);
	}
}
