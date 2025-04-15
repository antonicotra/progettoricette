import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { AuthComponent } from './components/auth/auth.component';
import { NoheaderLayoutComponent } from './layouts/noheader-layout/noheader-layout.component';
import { HeaderLayoutComponent } from './layouts/header-layout/header-layout.component';
import { authGuard, nonAuthGuard } from './guards/auth.guard';
import { VerifyemailComponent } from './components/verifyemail/verifyemail.component';

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
                component: AuthComponent,
                canActivate: [nonAuthGuard]
            },
            {
                path: 'verify-email',
                component: VerifyemailComponent,
                canActivate: [nonAuthGuard]
            }
        ]
    },
    {
        path: '',
        component: HeaderLayoutComponent,
        children: [
            {
                path: 'homepage',
                component: HomeComponent,
                canActivate: [authGuard]
            },
            {
                path: 'detail',
                component: RecipeDetailsComponent,
                canActivate: [authGuard]
            },
            {
                path: '**',
                component: NotfoundComponent
            }
        ]
    }
];