import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthComponent
    },
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
];
