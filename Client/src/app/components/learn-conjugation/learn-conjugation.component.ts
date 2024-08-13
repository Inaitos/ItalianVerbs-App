import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectTopCount} from "../../state/app.state.selectors";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-learn-conjugation',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './learn-conjugation.component.html',
  styleUrl: './learn-conjugation.component.scss'
})
export class LearnConjugationComponent {
  protected topCount$: Observable<number>;
  constructor(private store: Store) {
    this.topCount$ = this.store.select(selectTopCount);
  }
}
