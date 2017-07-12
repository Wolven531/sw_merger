import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { GeneratorComponent } from './generator.component';

const generatorRoutes: Routes = [
    {
        path: 'generator',
        children: [
            {
                path: '',
                component: GeneratorComponent,
            },
        ],
    },
];

export const GeneratorRouting = RouterModule.forChild(generatorRoutes);
