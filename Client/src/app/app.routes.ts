import { Routes } from '@angular/router';
import {LearnVerbsComponent} from "./components/learn-verbs/learn-verbs.component";
import {TrainConjugationsComponent} from "./components/train-conjugations/train-conjugations.component";
import {WelcomeComponent} from "./components/welcome/welcome.component";

export const routes: Routes = [
  {path: '', component: WelcomeComponent },
  {path: 'learn-verbs', component: LearnVerbsComponent },
  {path: 'train-conjugations', component: TrainConjugationsComponent}
];
