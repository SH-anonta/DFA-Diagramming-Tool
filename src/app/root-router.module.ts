import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router';
import {HomepageComponent} from './page-components/homepage/homepage.component';


let routes = [
  {path: '', component: HomepageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RootRouterModule {}
