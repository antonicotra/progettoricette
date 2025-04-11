import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { AuthComponent } from './components/auth/auth.component';
import { NoheaderLayoutComponent } from './layouts/noheader-layout/noheader-layout.component';
import { HeaderLayoutComponent } from './layouts/header-layout/header-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: NoheaderLayoutComponent,
        children: [
            {
                path: '',
                component: AuthComponent
            }
        ]
    },
    {
        path: '',
        component: HeaderLayoutComponent,
        children: [
            {
                path: 'homepage',
                component: HomeComponent
            },
            {
                path: 'detail',
                component: RecipeDetailsComponent
            },
            {
                path: '**',
                component: NotfoundComponent
            }
        ]
    }
];