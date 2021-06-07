import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserProfileComponent } from './user-profile.component';
import {UserProfileRoutingModule} from './user-profile-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { AngularCropperjsModule } from 'angular-cropperjs';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserProfileRoutingModule,
    SharedModule,
    NgxDatatableModule,
    FileUploadModule,
    AngularCropperjsModule
  ],
  declarations: [UserProfileComponent]
})
export class UserProfileModule { }
