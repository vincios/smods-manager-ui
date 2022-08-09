import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ModComponent } from './pages/mod/mod.component';
import {SettingsComponent} from "./pages/settings/settings.component";

const routes: Routes = [
    { path: "mod/:id", component: ModComponent },
    { path: "home", component: HomeComponent },
    { path: "settings", component: SettingsComponent },
    { path: '', redirectTo: "home", pathMatch: "full"},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
