import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileComponent } from './file/file.component';
import { ForecastComponent } from './forecast/forecast.component';
import { FrstComponent } from './frst/frst.component';
import { LoginComponent } from './login/login.component';
import { MetricsComponent } from './metrics/metrics.component';
import { PlotComponent } from './plot/plot.component';
import { SummaryComponent } from './summary/summary.component';


const routes: Routes = [
  {path:'',redirectTo:'frst',pathMatch:'full'},
  {path:'frst',component:FrstComponent},
  {path:'login',component:LoginComponent},
  {path:'plot',component:PlotComponent},
  {path:'file',component:FileComponent},
  {path:'forecast',component:ForecastComponent},
  {path:'metrics',component:MetricsComponent},
  {path:'summary',component:SummaryComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
