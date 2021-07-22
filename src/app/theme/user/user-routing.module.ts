import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Usuario',
      status: false
    },
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
      },
      {
        path: 'card',
        loadChildren: () => import('./user-card/user-card.module').then(m => m.UserCardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
