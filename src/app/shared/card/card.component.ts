import {Component, OnInit, Input, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {cardToggle, cardClose, cardIconToggle} from './card-animation';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [cardToggle, cardClose, cardIconToggle],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  @Input() headerContent: string;
  @Input() title: string;
  @Input() blockClass: string;
  @Input() cardClass: string;
  @Input() classHeader: boolean = false;
  @Input() cardOptionBlock: boolean = false;
  cardToggle = 'expanded';
  cardClose = 'open';
  fullCard: string;
  fullCardIcon: string;
  loadCard = false;
  isCardToggled = false;
  cardLoad: string;
  cardIconToggle: string;

  constructor() {
    this.fullCardIcon = 'fa-expand';
    this.cardIconToggle = 'an-off';
  }

  ngOnInit() {
    if (this.cardOptionBlock) {
      this.cardToggle = 'false';
    }
  }

  toggleCard(event) {
    this.cardToggle = this.cardToggle === 'collapsed' ? 'expanded' : 'collapsed';
  }

  toggleCardOption() {
    this.isCardToggled = !this.isCardToggled;
    this.cardIconToggle = this.cardIconToggle === 'an-off' ? 'an-animate' : 'an-off';
  }

  closeCard(event) {
    this.cardClose = this.cardClose === 'closed' ? 'open' : 'closed';
  }

  fullScreen(event) {
    this.fullCard = this.fullCard === 'full-card' ? '' : 'full-card';
    this.fullCardIcon = this.fullCardIcon === 'fa-expand' ? 'fa-compress' : 'fa-expand';
  }

  cardRefresh() {
    this.loadCard = true;
    this.cardLoad = 'card-load';
    setTimeout( () => {
      this.cardLoad = '';
      this.loadCard = false;
    }, 3000);
  }
}
