import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotificationService } from "../../../shared/notification";
import { EnsayoService } from "../../../services/ensayo/ensayo.service";
import { Ensayo } from "../../../models/ensayo";
import swal from "sweetalert2";
//se importo swal para alerta cambio de estado
import { ClienteService } from "../../../services/cliente/cliente.service";
import { ActividadService } from "../../../services/actividad/actividad.service";
import { Actividad } from "../../../models/actividad";
import * as moment from "moment";
import { EstructuraServiceService } from "../../../services/Estructura/Estructura-service.service";
import { Estructura } from "../../../models/estructura";
import * as XLSX from "xlsx";
import { isJSDoc } from "typescript";
moment.locale("es-CO");

@Component({
  selector: "app-orden",
  templateUrl: "./orden.component.html",
  styleUrls: [
    "./orden.component.scss",
    "../../../../assets/icon/icofont/css/icofont.scss"
  ]
})
export class OrdenComponent implements OnInit {
  fileName = "ExcelSheet.xlsx";
  form: FormGroup;
  resultArray: any;
  @Input() ensayo: Ensayo;
  @Output() reloaddata = new EventEmitter<string>();
  user: any;
  cliente: any;
  submited: boolean;
  showNavegacion: boolean = false;
  muestrasel: any;
  parametrosel: any;
  estructura: Estructura;
  constructor(
    private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private estructuraService: EstructuraServiceService,
    private actividadService: ActividadService
  ) {
    this.ensayo = new Ensayo();
    this.user = JSON.parse(localStorage.getItem("userInfo"));
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fEntrega: [null, Validators.required],
      fEnsayo: [null, Validators.required],
      estado: []
    });
    this.estructuraService.get(0).subscribe(resp => {
      if (resp.success) {
        this.estructura = resp.Layouts[0];
      } else {
        if (resp.cantidad === 0) {
          const estructura = {
            nombre: "Estructura",
            header: "<p>Header</p>",
            footer: "<p>Footer</p>",
            tercero: this.user.tercero._id
          };
          this.estructuraService
            .create(estructura)
            .subscribe((respuesta: any) => {
              if (respuesta.success) {
                this.estructura = respuesta.layout;
              } else {
                alert(respuesta.message);
              }
            });
        } else {
          alert(resp.message);
        }
      }
    });
  }
  closeMyModal(event) {
    this.reloaddata.emit("hide");
  }
  cargarEnsayos(tipo) {
    this.reloaddata.emit("cargar");
  }
  cargarEmpresa() {
    this.clienteService.getById(this.user.tercero._id).subscribe(
      value => {
        this.cliente = value.clientes;
      },
      err => {
        this.notificationService.addNotify({
          title: "Alerta",
          msg: "Por favor valide los datos ",
          type: "error"
        });
      }
    );
  }

  cambiaEstadoGuardar() {
    swal({
      title: "Alerta!",
      text: `¿ Realmente quieres cambiar a otra etapa`,
      showCancelButton: true,
      confirmButtonText: "Si, Cambiar!",
      cancelButtonText: "No",
      useRejections: true // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then(result => {
      const btn = document.getElementById("btnGuardarEnsayo");
      btn.click();
    });
  }
  cargaActividades() {
    setTimeout(() => {
      const activityButton = document.getElementById("basic-addon2");
      activityButton.click();
    }, 5000);
  }

  guardarEnsayo(event) {
    this.cargaActividades();
    this.submited = true;
    if (this.ensayo.fEnsayo !== undefined) {
      this.ensayo.fEnsayo = moment(this.ensayo.fEnsayo).format();
    }
    if (this.ensayo.fEntrega !== undefined) {
      this.ensayo.fEntrega = moment(this.ensayo.fEntrega).format();
    }
    if (this.ensayo.fsolicitud !== undefined) {
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format();
    }

    if (this.ensayo._id === undefined) {
      this.ensayo.tercero = this.user.tercero._id;
      this.ensayo.paso = 1;
      this.ensayoservice.add(this.ensayo).subscribe(
        value => {
          this.cargarEnsayos("Pendientes");
          this.notificationService.addNotify({
            title: "Alerta",
            msg: "Ensayo guardado con exito",
            type: "success"
          });
          this.closeMyModal("effect-3");
        },
        err => {
          this.notificationService.addNotify({
            title: "Alerta",
            msg: "Por favor valide los datos ",
            type: "error"
          });
        }
      );
    } else {
      if (this.ensayo.paso === 3) {
        this.ensayo.estado = "En Reporte";
      } else {
        let enproceso = 0;
        // console.log('entro aca');
        // console.log('original');
        // console.log(muestras2)
        // console.log('copia');

        // console.log(newArray)

        // for(let i = 0;i<3; i++){
        //  var value = newArray[i].muestras[0].valor;
        //  console.log('original')
        //   console.log(value)
        //   // newArray.forEach(parametro =>{
        //   //   const result = parametro.muestras.map(a => a.valor);
        //   //   for (let i = 0; i < result.length; i++) {
        //   //           result[i] = result[i].replace(',', '.');
        //   //         }for (let i = 0; i < parametro.muestras.length; i++) {
        //   //   parametro.muestras[i] = Object.assign({}, parametro.muestras[i], { valor: result[i] });
        //   // }
        //   // });
        //   console.log('modificado')
        //   newArray[i].muestras[0].valor = newArray[i].muestras[0].valor.replace(',', '.');
        //   var value = newArray[i].muestras[0].valor;
        //   console.log(value)

        // }

        // this.ensayo.parametros.forEach(parametro=>{
        //   const result = parametro.muestras.map(a => a.valor);
        //     for (let i = 0; i < result.length; i++) {
        //       // result[i] = result[i].replace(',', '.');
        //     }
        //     for (let i = 0; i < parametro.muestras.length; i++) {
        //       // parametro.muestras[i] = Object.assign({}, parametro.muestras[i], { valor: result[i] });
        //       for (let j = 0; j< this.ensayo.parametros.length; j++){
        //       newArray[j].muestras[i] = Object.assign({}, newArray[j].muestras[i], { valor: result[i] });
        //       }
        //     }

        // })

        // console.log(muestras2);

        //REMPLAZAR , POR .
        // this.ensayo.parametros.forEach(parametro => {
        //   const result = parametro.muestras.map(a => a.valor);
        //   for (let i = 0; i < result.length; i++) {
        //     result[i] = result[i].replace(",", ".");
        //   }
        //   for (let i = 0; i < parametro.muestras.length; i++) {
        //     parametro.muestras[i] = Object.assign({}, parametro.muestras[i], {
        //       valor: result[i]
        //     });
        //   }
        // });

        this.ensayo.parametros.forEach(element => {
          element["muestras"].forEach(muestras => {
            if (enproceso === 0) {
              // console.log('entro por que es igual a 0');
              if (muestras["seleccionado"]) {
                // console.log(muestras['valor']);
                if (muestras["valor"] === null || muestras["valor"] === "") {
                  this.ensayo.estado = "En Proceso";
                  enproceso = 1;
                  // console.log('entro uno vacio');
                } else {
                  if (this.ensayo.estado === "En Reporte") {
                    this.ensayo.estado = "En Reporte";
                  } else {
                    this.ensayo.estado = "Completado";
                    // console.log('lo completo por que entro aca');
                  }
                }
              }
            }
          });
        });
      }
      this.ensayo.encReporte = this.estructura.header;
      this.ensayo.pieReporte = this.estructura.footer;
      this.ensayo.Estructura = false;
      this.ensayoservice.update(this.ensayo).subscribe(
        value => {
          this.cargarEnsayos("Pendientes");
          this.notificationService.addNotify({
            title: "Alerta",
            msg: "Ensayo Actualizado con exito",
            type: "success"
          });
          this.closeMyModal("effect-3");
        },
        err => {
          this.notificationService.addNotify({
            title: "Alerta",
            msg: "Por favor valide los datos ",
            type: "error"
          });
        }
      );
    }
  }
  guardarEnsayo2(event) {
    this.cargaActividades();
    this.submited = true;
    if (this.form.invalid) {
      return false;
    }
    this.submited = false;
    if (this.ensayo.fEnsayo !== undefined) {
      this.ensayo.fEnsayo = moment(this.ensayo.fEnsayo).format();
    }
    if (this.ensayo.fEntrega !== undefined) {
      this.ensayo.fEntrega = moment(this.ensayo.fEntrega).format();
    }
    if (this.ensayo.fsolicitud !== undefined) {
      this.ensayo.fsolicitud = moment(this.ensayo.fsolicitud).format();
    }
    if (this.ensayo._id == undefined) {
      this.ensayo.tercero = this.user.tercero._id;
      this.ensayoservice.add(this.ensayo).subscribe(
        value => {
          this.cargarEnsayos("Pendientes");
        },
        err => {
          this.notificationService.addNotify({
            title: "Alerta",
            msg: "Por favor valide los datos ",
            type: "error"
          });
        }
      );
    } else {
      this.ensayo.encReporte = this.estructura.header;
      this.ensayo.pieReporte = this.estructura.footer;
      this.ensayo.Estructura = false;
      this.ensayoservice.update(this.ensayo).subscribe(
        value => {
          this.cargarEnsayos("Pendientes");
        },
        err => {
          this.notificationService.addNotify({
            title: "Alerta",
            msg: "Por favor valide los datos ",
            type: "error"
          });
        }
      );
    }
  }
  guardarActividades(descripcion, tipoComentario, id) {
    const actividad = new Actividad();
    actividad.cliente = this.ensayo.cliente;
    actividad.descripcion = descripcion;
    actividad.ensayo = id;
    actividad.tercero = this.user.tercero;
    actividad.usuario = this.user.id;
    actividad.fecha = new Date().toISOString().split("T")[0];
    actividad.nombreUsuarioCreador = this.user.name;
    actividad.tipoComentario = tipoComentario;
    this.actividadService.add(actividad).subscribe(
      value => { },
      err => {
        this.notificationService.addNotify({
          title: "Alerta",
          msg: "No se pudo almacenar la audirotia ",
          type: "error"
        });
      }
    );
  }
  calcularVigencia() {
    const now = moment();
    const fentrega = moment(this.ensayo.fEntrega, "YYYY/MM/DD");
    const dayHoy = now.format("D");
    const dayEntrega = fentrega.format("D");
    const fentregaMes = parseInt(fentrega.format("M"));
    const nowMes = parseInt(now.format("M"));

    if (fentregaMes !== nowMes) {
      let difDias = fentrega.diff(now, "days");
      if (difDias < 0) {
        return difDias;
      } else if (difDias > 0) {
        return (difDias = difDias + 1);
      }
      return difDias;
    } else {
      const difDias = parseInt(dayEntrega) - parseInt(dayHoy);
      return difDias;
    }
  }

  pasarAEnReporte(event) {
    this.ensayo.estado = "En Reporte";
    this.ensayo.paso = 3;
  }

  pasarAEnReporte2(event) {
    this.cargaActividades();
    swal({
      title: "Alerta!",
      text: "¿ Estas seguro de tus resultados y quieres empezar tu reporte ?",
      showCancelButton: true,
      confirmButtonText: "Si, Continuar!",
      cancelButtonText: "No",
      useRejections: true // <<<<<<------- BACKWARD COMPATIBILITY WITH v6.x
    }).then(result => {
      this.pasarAEnReporte(event);
      this.guardarEnsayo(event);
      this.guardarActividades(
        "Movió la solicitud a En proceso de ensayo a en Reporte",
        "Reporte",
        this.ensayo._id
      );
    });
  }

  inputs(event, array, index, index2) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const row_data = pastedText.split('\n');

    var dd = [];
    row_data.forEach(row_data => {
      if (row_data != "") {
        dd.push(row_data.split('\t'));
      }
    });

    var cont = -1;
    var saveindex = index;
    var saveIndex2 = index2 - 1
    for (index; index < array.length; index++) {
      cont += 1
      if (cont === dd.length) {
        break;
      }
      index2 = saveIndex2
      for (let x = 0; x < dd[0].length; x++) {
        index2 += 1;
        if (array[index].muestras[index2] == undefined) {
          break;
        }
        array[index].muestras[index2].valor = dd[cont][x]
      }
    }
    setTimeout(() => {
      array[saveindex].muestras[saveIndex2 + 1].valor = dd[0][0];

    }, 100);


  }

  showContenidoNavegacion() {
    if (this.showNavegacion == false) {
      this.showNavegacion = true;
    } else if (this.showNavegacion == true) {
      this.showNavegacion = false;
    }
  }
  uploadfile(value) {
    this.ensayo.archivos = value;
  }
  abrirparametros(parametro, muestra, j) {
    this.muestrasel = muestra;
    this.parametrosel = parametro;
  }
  endAction($event) {
    if ($event != undefined && $event != null) {
      this.muestrasel.valor = $event.resultado;
      this.muestrasel.parambase = $event._id;
    }
    this.muestrasel = undefined;
  }
  abrirDetalle(parametro, muestra) {
    parametro.show = !parametro.show;
    parametro.muestrasel = muestra;
    return false;
  }
  exportexcel(): void {
    var muestras2 = this.ensayo.parametros;

    var newArray = muestras2.map(obj => ({ ...obj }));

    // newArray.forEach(parametro => {
    //   const result = parametro.muestras.map(a => a.valor);
    //   for (let i = 0; i < result.length; i++) {
    //     result[i] = result[i].replace(",", ".");
    //   }
    //   for (let i = 0; i < parametro.muestras.length; i++) {
    //     parametro.muestras[i] = Object.assign({}, parametro.muestras[i], {
    //       valor: result[i]
    //     });
    //   }
    // });
    let codigo: String;
    /* table id is passed over here */
    codigo = this.ensayo.codigo + " Datos";

    this.fileName = codigo + ".xlsx";
    const element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {
      raw: false
    });
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
