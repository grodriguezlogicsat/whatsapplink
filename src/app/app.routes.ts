import { Routes } from '@angular/router';
import { GeneratorComponent } from './generator/generator.component';
import { OpenComponent } from './open.component';


export const routes: Routes = [
    { path: '', component: GeneratorComponent },
    { path: 'open', component: OpenComponent }, // /#/open?c=...&iv=...&k=...
    { path: '**', redirectTo: '' }
];