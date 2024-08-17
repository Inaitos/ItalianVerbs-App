import {createFeatureSelector, createSelector, Store} from "@ngrx/store";
import {AppState} from "./app.state";
import {filter, map, Observable, withLatestFrom} from "rxjs";

export interface VerbsDisplayData {
  verbs: string[];
  verbsConj: Record<string, Record<string, string>>;
  verbsTranslations: Record<string, string[]>;
  conjGroup: string;
  conjGroups: string[];
}
export const selectAppState = createFeatureSelector<AppState>('app');
export const selectVerbs = createSelector(selectAppState, state => state.verbs);
export const selectTopCount = createSelector(selectAppState, state => state?.topCount ?? 999);
export const selectBatchSettings = createSelector(selectAppState, state => ({topCount: state.topCount, batch: state.batchSize}));
export const selectConj = createSelector(selectAppState, state => ({group: state.conjugationGroup, groups: state.conjugationGroups}));
export const selectVerbsData = createSelector(selectAppState, state => ({verbs: state.verbs, verbsConj: state.verbsConj, verbsTranslations: state.verbsTranslations}));


export function ObserveVerbsData(store: Store): Observable<VerbsDisplayData> {
  return store.select(selectVerbsData)
    .pipe(
      filter(v => v.verbs != null && v.verbsConj != null && v.verbsTranslations != null),
      withLatestFrom(store.select(selectConj)),
      //conjGroup: conjCfg.group, conjGroups: conjCfg.group, verbsTran: verbsData.verbsTranslations, verbsConj: verbsData.verbsConj
      map(([verbsData, conjCfg]) => (<VerbsDisplayData>{verbs: verbsData.verbs, verbsConj: verbsData.verbsConj, verbsTranslations: verbsData.verbsTranslations, conjGroups: conjCfg.groups, conjGroup: conjCfg.group}))
    );
}
