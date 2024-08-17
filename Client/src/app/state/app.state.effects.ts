import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {VerbsApi} from "../api/verbs-api";
import {AppActions} from "./app.state.actions";
import {filter, forkJoin, map, switchMap, tap, withLatestFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectBatchSettings, selectConj, selectVerbs} from "./app.state.selectors";
import {DtoConjugation} from "../api/verbs";

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
    map(verbs => AppActions.setBatchData({verbs: verbs}))
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

  loadVerbsData$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.setBatchData),
    tap(a=>{console.log('AppActions.setBatchData', a)}),
    map(v => v.verbs),
    filter(v => (v?.length ?? 0) > 0),
    withLatestFrom(this.store.select(selectConj)),
    map(([verbs, conjConfig])=>({verbs, conjGroup: conjConfig.group})),
    switchMap(cfg =>
      forkJoin([
        forkJoin(
          cfg.verbs.map(v => this.api.getWordConjugations(v, cfg.conjGroup).pipe(map(c => ({verb: v, conjugations: c}))))
        ),
        forkJoin(
          cfg.verbs.map(v => this.api.getWordTranslations(v).pipe(map(tt => ({verb: v, trans: tt}))))
        ),
      ])
    ),
    map(([resultConj, resultTrans]) =>
      ({
        verbs: resultConj.map(v => v.verb),
        conj: resultConj.reduce<Record<string, Record<string, string>>>(
          (map, el) => {map[el.verb] = this.toConjugationsDct(el.conjugations); return map; },{}),
        trans: resultTrans.reduce<Record<string, string[]>>((map, el) => {map[el.verb] = el.trans.map(a => a.translation!); return map;}, {})
      })
    ),
    map(a => AppActions.setVerbsData({verbsConj: a.conj, verbsTranslations: a.trans}))
  ))

  toConjugationsDct(conj: DtoConjugation[]): Record<string, string> {
    const ret = conj.reduce<Record<string, string>>( (map, el) => {map[el.form!] = el.shortValue!; return map;}, {});
    return ret;
  }

  private filterTranslation(t: string): boolean {
    switch (t)  {
      case "Extended meanings":
      case "Figurative meanings":
        return false;
    }
    return true;
  }

}
