import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'homepage',
        pathMatch: 'full'
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
