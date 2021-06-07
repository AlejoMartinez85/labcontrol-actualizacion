import { Injectable } from '@angular/core';
import { UserCardComponent } from '../../theme/user/user-card/user-card.component';
import { UserRoutingModule } from '../../theme/user/user-routing.module';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Logística laboratorio',
    main: [

      {
        main_state: 'ensayos',
        state: 'admin',
        short_label: 'N',
        name: 'Principal',
        type: 'link',
        icon: 'ti-home'
      },
      {
        main_state: 'ensayos',
        state: 'ensayos',
        short_label: 'N',
        name: 'Ensayos',
        type: 'link',
        icon: 'fa fa-flask'
      },
      {
        main_state: 'ensayos',
        state: 'reporte',
        short_label: 'N',
        name: 'Reportes',
        type: 'link',
        icon: 'fa fa-file-text-o'
      },

      {
        main_state: 'ensayos',
        state: 'recepcionEnsayo',
        short_label: 'N',
        name: 'Recepción de muestras',
        type: 'link',
        icon: 'fa fa-cube'
      }
    ],
  },
  {
    label: 'Configuraciones',
    main: [
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'agrupacionparametro',
        short_label: 'N',
        name: 'Agrupación Parámetros',
        type: 'link',
        icon: 'ti-layers-alt'
      },
      {
        main_state: 'config',
        state: 'usuario',
        short_label: 'N',
        name: 'usuarios',
        type: 'link',
        icon: 'ti-user'
      },
      {
        main_state: 'config',
        state: 'reporte',
        short_label: 'N',
        name: 'Config. Reporte',
        type: 'link',
        icon: 'ti-write'
      },
      {
        state: 'config',
        short_label: 'D',
        name: 'Clientes',
        type: 'sub',
        icon: 'fa fa-users',
        children: [
          {
            state: 'cliente',
            name: 'Listado Clientes'
          },
          {
            state: 'invitacion',
            name: 'Invitaciones'
          },
          
        ]
      }
    ]
  },

];

const MENUITEMSCLI = [
  {
    label: 'Navegación',
    main: [

      {
        main_state: 'ensayos',
        state: 'admin',
        short_label: 'N',
        name: 'Principal',
        type: 'link',
        icon: 'ti-home'
      },
      {
        main_state: 'ensayos',
        state: 'reporte',
        short_label: 'N',
        name: 'Historial de Reportes',
        type: 'link',
        icon: 'fa fa-file-text-o'
      },


    ],
  },
  {
    label: 'Configuracion',
    main: [
      {
        state: 'config',
        short_label: 'D',
        name: 'Invitaciones',
        type: 'sub',
        icon: 'ti-check-box',
        children: [
          {
            state: 'invitacion',
            name: 'Invitaciones'
          },
          {
            state: 'laboratorio',
            name: 'Laboratorio'
          }
        ]
      }
    ]
  },

];
const MENUITEMSANALISTA = [
  {
    label: 'Menu de ensayos',
    main: [

      {
        main_state: 'ensayos',
        state: 'ensayos',
        short_label: 'N',
        name: 'Ensayos',
        type: 'link',
        icon: 'fa fa-flask'
      }
    ],
    
  },


];




const MENUCONTROL17025ADMIN = [
  {
    label: 'Control 17025',
    main: [
      {
        main_state: 'config',
        state: 'usuario',
        short_label: 'N',
        name: 'usuarios',
        type: 'link',
        icon: 'ti-user'
      },
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros e incertidumbre',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'condiciones-ambientales',
        short_label: 'N',
        name: 'Condiciones Ambientales',
        type: 'link',
        icon: 'fa fa-umbrella'
      },
      {
        main_state: 'config',
        state: 'cartas-control',
        short_label: 'N',
        name: 'Cartas de Control',
        type: 'link',
        icon: 'fa fa-line-chart'
      },
      {
        main_state: 'config',
        state: 'datos-atipicos',
        short_label: 'N',
        name: 'Datos Atípicos',
        type: 'link',
        icon: 'fa fa-industry'
      },
      {
        main_state: 'config',
        state: 'derivada-instrumental',
        short_label: 'N',
        name: 'Deriva Intrumental',
        type: 'link',
        icon: 'fa fa-deviantart'
      },
      {
        main_state: 'config',
        state: 'validacion-de-metodos',
        short_label: 'N',
        name: 'Validación de Métodos',
        type: 'link',
        icon: 'fa fa-list'
      },
      {
        main_state: 'config',
        state: 'equipos',
        short_label: 'N',
        name: 'Equipos',
        type: 'link',
        icon: 'fa fa-wrench'
      }
      
      
    ],
  },


];

const MENUCONTROL17025ANALYST = [
  {
    label: 'Control 17025',
    main: [
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros e incertidumbre',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'condiciones-ambientales',
        short_label: 'N',
        name: 'Condiciones Ambientales',
        type: 'link',
        icon: 'fa fa-umbrella'
      },
      {
        main_state: 'config',
        state: 'cartas-control',
        short_label: 'N',
        name: 'Cartas de Control',
        type: 'link',
        icon: 'fa fa-line-chart'
      },
      {
        main_state: 'config',
        state: 'datos-atipicos',
        short_label: 'N',
        name: 'Datos Atípicos',
        type: 'link',
        icon: 'fa fa-industry'
      },
      {
        main_state: 'config',
        state: 'derivada-instrumental',
        short_label: 'N',
        name: 'Deriva Intrumental',
        type: 'link',
        icon: 'fa fa-deviantart'
      },
      {
        main_state: 'config',
        state: 'validacion-de-metodos',
        short_label: 'N',
        name: 'Validación de Métodos',
        type: 'link',
        icon: 'fa fa-list'
      },
      {
        main_state: 'config',
        state: 'equipos',
        short_label: 'N',
        name: 'Equipos',
        type: 'link',
        icon: 'fa fa-wrench'
      }
    ],
  },


];

// check
const MENULABCONTROLADMIN = [
  {
    label: 'Logística laboratorio',
    main: [

      {
        main_state: 'ensayos',
        state: 'admin',
        short_label: 'N',
        name: 'Principal',
        type: 'link',
        icon: 'ti-home'
      },
      {
        main_state: 'ensayos',
        state: 'ensayos',
        short_label: 'N',
        name: 'Ensayos',
        type: 'link',
        icon: 'fa fa-flask'
      },
      {
        main_state: 'ensayos',
        state: 'reporte',
        short_label: 'N',
        name: 'Reportes',
        type: 'link',
        icon: 'fa fa-file-text-o'
      },

      {
        main_state: 'ensayos',
        state: 'recepcionEnsayo',
        short_label: 'N',
        name: 'Recepción de muestras',
        type: 'link',
        icon: 'fa fa-cube'
      }
    ],
  },
  {
    label: 'Configuraciones',
    main: [
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'agrupacionparametro',
        short_label: 'N',
        name: 'Agrupación Parámetros',
        type: 'link',
        icon: 'ti-layers-alt'
      },
      {
        main_state: 'config',
        state: 'usuario',
        short_label: 'N',
        name: 'usuarios',
        type: 'link',
        icon: 'ti-user'
      },
      {
        main_state: 'config',
        state: 'reporte',
        short_label: 'N',
        name: 'Config. Reporte',
        type: 'link',
        icon: 'ti-write'
      },
      {
        state: 'config',
        short_label: 'D',
        name: 'Clientes',
        type: 'sub',
        icon: 'fa fa-users',
        children: [
          {
            state: 'cliente',
            name: 'Listado Clientes'
          },
          {
            state: 'invitacion',
            name: 'Invitaciones'
          },
          
        ]
      }
    ]
  },
];


const MENULABCONTROLANALYST = [
  {
    label: 'Módulos Ensayo',
    main: [
      {
        main_state: 'ensayos',
        state: 'ensayos',
        short_label: 'N',
        name: 'Ensayos',
        type: 'link',
        icon: 'fa fa-flask'
      }
    ],
  }
];

const SAMPLERECEPTION = [
  {
    label: 'Módulos Recepción de Muestras',
    main: [

      {
        main_state: 'ensayos',
        state: 'recepcionEnsayo',
        short_label: 'N',
        name: 'Recepción Muestras',
        type: 'link',
        icon: 'fa fa-cube'
      }
    ],
  },


];

// check
const MENU17025= [
  {
    label: 'Control 17025',
    main: [
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros e Incertidumbre',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'condiciones-ambientales',
        short_label: 'N',
        name: 'Condiciones Ambientales',
        type: 'link',
        icon: 'fa fa-umbrella'
      },
      {
        main_state: 'config',
        state: 'cartas-control',
        short_label: 'N',
        name: 'Cartas de Control',
        type: 'link',
        icon: 'fa fa-line-chart'
      },
      {
        main_state: 'config',
        state: 'datos-atipicos',
        short_label: 'N',
        name: 'Datos Atípicos',
        type: 'link',
        icon: 'fa fa-industry'
      },
      {
        main_state: 'config',
        state: 'derivada-instrumental',
        short_label: 'N',
        name: 'Deriva Intrumental',
        type: 'link',
        icon: 'fa fa-deviantart'
      },
      {
        main_state: 'config',
        state: 'validacion-de-metodos',
        short_label: 'N',
        name: 'Validación de Métodos',
        type: 'link',
        icon: 'fa fa-list'
      },
      {
        main_state: 'config',
        state: 'equipos',
        short_label: 'N',
        name: 'Equipos',
        type: 'link',
        icon: 'fa fa-wrench'
      }
    ],
  },
];

// check
const MENU17025ADMIN = [
  {
    label: 'Control 17025',
    main: [
      {
        main_state: 'config',
        state: 'usuario',
        short_label: 'N',
        name: 'Usuarios',
        type: 'link',
        icon: 'ti-user'
      },
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros e Incertidumbre',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'condiciones-ambientales',
        short_label: 'N',
        name: 'Condiciones Ambientales',
        type: 'link',
        icon: 'fa fa-umbrella'
      },
      {
        main_state: 'config',
        state: 'cartas-control',
        short_label: 'N',
        name: 'Cartas de Control',
        type: 'link',
        icon: 'fa fa-line-chart'
      },
      {
        main_state: 'config',
        state: 'datos-atipicos',
        short_label: 'N',
        name: 'Datos Atípicos',
        type: 'link',
        icon: 'fa fa-industry'
      },
      {
        main_state: 'config',
        state: 'derivada-instrumental',
        short_label: 'N',
        name: 'Deriva Intrumental',
        type: 'link',
        icon: 'fa fa-deviantart'
      },
      {
        main_state: 'config',
        state: 'validacion-de-metodos',
        short_label: 'N',
        name: 'Validación de Métodos',
        type: 'link',
        icon: 'fa fa-list'
      },
      {
        main_state: 'config',
        state: 'equipos',
        short_label: 'N',
        name: 'Equipos',
        type: 'link',
        icon: 'fa fa-wrench'
      }
      
      
    ],
  },
]; 

// check
const MENU17025ANALYST = [
  {
    label: 'Control 17025',
    main: [
      {
        main_state: 'config',
        state: 'parametro',
        short_label: 'N',
        name: 'Parámetros e Incertidumbre',
        type: 'link',
        icon: 'ti-ruler-pencil'
      },
      {
        main_state: 'config',
        state: 'condiciones-ambientales',
        short_label: 'N',
        name: 'Condiciones Ambientales',
        type: 'link',
        icon: 'fa fa-umbrella'
      },
      {
        main_state: 'config',
        state: 'cartas-control',
        short_label: 'N',
        name: 'Cartas de Control',
        type: 'link',
        icon: 'fa fa-line-chart'
      },
      {
        main_state: 'config',
        state: 'datos-atipicos',
        short_label: 'N',
        name: 'Datos Atípicos',
        type: 'link',
        icon: 'fa fa-industry'
      },
      {
        main_state: 'config',
        state: 'derivada-instrumental',
        short_label: 'N',
        name: 'Deriva Intrumental',
        type: 'link',
        icon: 'fa fa-deviantart'
      },
      {
        main_state: 'config',
        state: 'validacion-de-metodos',
        short_label: 'N',
        name: 'Validación de Métodos',
        type: 'link',
        icon: 'fa fa-list'
      },
      {
        main_state: 'config',
        state: 'equipos',
        short_label: 'N',
        name: 'Equipos',
        type: 'link',
        icon: 'fa fa-wrench'
      }
    ],
  },
]; 



@Injectable({
  providedIn: 'root'
})
export class MenuItems {
  getAll(): Menu[] {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    // ATRIBUTOS PRUEBAS
    // user.tercero.tipo = 1
    // user.analista = true;
    // user.recepcionM = true;
    // user.plataformaAdmin = true;
    // user.plataformaTecnica = false;
    //  user.infofinanciera = true;

    // IF CLIENT
    if (user.tercero != undefined && user.tercero.tipo == 1) {
      // 1 check
      return MENUITEMSCLI;
    } 
    // IF NORMAL USER
    else if(user.tercero != undefined && user.tercero.tipo == 2 ){

      // PLATFORM ADMIN 
      if(user.plataformaAdmin == true){
        if(user.plataformaTecnica == true){
          if(user.analista == false){
            // 2 check
            // console.log('menu admin y tecnico')
            return MENULABCONTROLADMIN.concat(MENU17025);

          }else if (user.analista == true){

            if(user.recepcionM == true){
              // 3 check
              // console.log('menu ensayo, recepcion M y tecnico')
              return MENULABCONTROLANALYST.concat(SAMPLERECEPTION).concat(MENU17025ANALYST)
            }else if (user.recepcionM == false){
              // 4 check
              // console.log('menu ensayo y tecnico')
              return MENULABCONTROLANALYST.concat(MENU17025ANALYST)
            }
          }
        }
        else if (user.plataformaTecnica == false){
          if(user.analista == false){
            // 5 check
            // console.log('menu admin')
            return MENULABCONTROLADMIN ;

          }else if (user.analista == true){

            if(user.recepcionM == true){
              // 6 check
              // console.log('menu ensayo, recepcion M')
              return MENULABCONTROLANALYST.concat(SAMPLERECEPTION);
            }else if (user.recepcionM == false){
              // console.log('menu ensayo')
              // 7 check
              return MENULABCONTROLANALYST;
            }
          }
        }
      }

      //NO PLATFORM ADMIN 
      if(user.plataformaAdmin == false){
        if(user.plataformaTecnica == true){

          if(user.analista == false){
            // 8
            // console.log('menu tecnico')
            return MENU17025ADMIN;

          }else if (user.analista == true){
            // 9
            // console.log('menu tecnico & analista')
            return MENU17025ANALYST;
          }

        }else{
          // check
          // console.log('NO PADMIN , NO PTECNICA')
        }
      }
    }else{}
  }
}
