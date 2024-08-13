import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {map, Observable} from "rxjs";
import {selectTopCount, selectVerbs} from "../../state/app.state.selectors";
import {AsyncPipe} from "@angular/common";
import {AppActions} from "../../state/app.state.actions";

@Component({
  selector: 'app-learn-conjugation',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './learn-conjugation.component.html',
  styleUrl: './learn-conjugation.component.scss'
})
export class LearnConjugationComponent implements OnInit {
  protected topCount$: Observable<number>;
  protected verbs$: Observable<string[]>;
  constructor(private store: Store) {
    this.topCount$ = this.store.select(selectTopCount);
    this.verbs$ = this.store.select(selectVerbs).pipe(map(a => a ?? []));
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.initIfEmpty());
  }
}

