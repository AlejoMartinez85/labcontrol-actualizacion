import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';
import { Ensayo } from '../../../models/ensayo';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { FiledownloadService } from '../../../services/filedownload/filedownload.service';
import { Actividad } from '../../../models/actividad';
import { ActividadService } from '../../../services/actividad/actividad.service';
@Component({
  selector: 'app-vistaprevia',
  templateUrl: './vistaprevia.component.html',
  styleUrls: ['./vistaprevia.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss']
})
export class VistapreviaComponent implements OnInit {
  ensayo: Ensayo;
  ensayo_id: any;
  user: any;
  constructor(private notificationService: NotificationService,
    private ensayoservice: EnsayoService,
    private route: ActivatedRoute,
    private filedownloadService: FiledownloadService,
    private actividadService: ActividadService) {

    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit() {
    this.ensayo = new Ensayo();
    this.ensayo_id = this.route.snapshot.paramMap.get('id');
   
  }

 

}
