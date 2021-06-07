import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class NotificationService {
	options: any = {
		position: ['bottom', 'right'],
	};

	position1 = 'bottom';
	position2 = 'right';
	timeOut = 1000;
	showProgressBar = true;
	pauseOnHover = true;
	lastOnBottom = true;
	clickToClose = true;
	maxLength = 0;
	maxStack = 8;
	preventDuplicates = false;
	preventLastDuplicates = false;
	theClass: string;
	rtl = false;
	animate = 'fromRight';
	icons: string;
	subType = 'success';

	title: string;
	msg: string;

	constructor(private servicePNotify: NotificationsService) {
		this.options = {
			position: [
				this.position1,
				this.position2
			],
			maxStack: this.maxStack,
			timeOut: this.timeOut,
			showProgressBar: this.showProgressBar,
			pauseOnHover: this.pauseOnHover,
			lastOnBottom: this.lastOnBottom,
			clickToClose: this.clickToClose,
			maxLength: this.maxLength,
			preventDuplicates: this.preventDuplicates,
			preventLastDuplicates: this.preventLastDuplicates,
			theClass: this.theClass,
			rtl: this.rtl,
			animate: this.animate,
			icons: this.icons
		};
	 }

	ngOnInit() {
		this.options = {
			position: [
				this.position1,
				this.position2
			],
			maxStack: this.maxStack,
			timeOut: this.timeOut,
			showProgressBar: this.showProgressBar,
			pauseOnHover: this.pauseOnHover,
			lastOnBottom: this.lastOnBottom,
			clickToClose: this.clickToClose,
			maxLength: this.maxLength,
			preventDuplicates: this.preventDuplicates,
			preventLastDuplicates: this.preventLastDuplicates,
			theClass: this.theClass,
			rtl: this.rtl,
			animate: this.animate,
			icons: this.icons
		};
	}

	addNotify(options) {
		this.servicePNotify.remove();


		switch (options.type) {
			case 'success':
				this.servicePNotify.success(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
			case 'error':
				this.servicePNotify.error(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
			case 'alert':
				this.servicePNotify.error(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
			case 'warn':
				this.servicePNotify.error(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
			case 'info':
				this.servicePNotify.info(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
			case 'create':
				this.servicePNotify.create(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg,
					options.type ? options.type : this.subType
				);
				break;
			case 'html':
				this.servicePNotify.html(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
			default:
				this.servicePNotify.alert(
					options.title ? options.title : this.title,
					options.msg ? options.msg : this.msg
				);
				break;
		}
	}
}
