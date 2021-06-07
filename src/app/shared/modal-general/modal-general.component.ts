import { Component, OnInit, Input } from '@angular/core';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-modal-general',
  templateUrl: './modal-general.component.html',
  styleUrls: ['./modal-general.component.scss']
})
export class ModalGeneralComponent implements OnInit {
  @Input() modalClass: string;
  @Input() contentClass: string;
  @Input() modalID: string;
  @Input() backDrop = false;
  @Input() title: string;
  constructor() { }

  ngOnInit() {
  }
  close(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
  
}
