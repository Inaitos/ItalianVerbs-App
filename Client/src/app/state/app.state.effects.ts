import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {VerbsApi} from "../api/verbs-api";
import {AppActions} from "./app.state.actions";
import {map, switchMap, tap, withLatestFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectBatchSettings, selectVerbs} from "./app.state.selectors";

@Injectable()
export class AppStateEffects {
  constructor(
    private actions$: Actions,
    private api: VerbsApi,
    private store: Store
  ){
    console.log('AppStateEffects.constr', store);
  }

  loadNextBatch$ = createEffect( ()=> this.actions$.pipe(
    ofType(AppActions.loadNextBatch),
    tap(_ => console.log('AppActions.loadNextBatch')),
    withLatestFrom(this.store.select(selectBatchSettings)),
    switchMap(([_, bs]) => this.api.getWordsBatch(bs.topCount, bs.batch)),
    tap(batch => console.log('AppActions.loadNextBatch2', batch)),
    map(words => AppActions.setBatchData({words: words}))
  ));


  initIfEmpty$ = createEffect( ()=> this.actions$.pipe(
    ofType(AppActions.initIfEmpty),
    tap(_ => console.log('AppActions.initIfEmpty')),
    withLatestFrom(this.store.select(selectVerbs)),
    map(([_, verbs]) => {
      tap(_ => console.log('InitIfEmpty2', verbs));
      return !verbs ? AppActions.loadNextBatch() : AppActions.doNothing();
    })
  ));
}
