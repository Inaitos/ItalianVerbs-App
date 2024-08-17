import {createReducer, on} from "@ngrx/store";
import {AppActions} from "./app.state.actions"

export interface AppState {
  verbs?: string[],
  topCount: number,
  batchSize: number,
  conjugationGroup: string,
  conjugationGroups: string[],
  verbsConj?: Record<string, Record<string, string>>;
  verbsTranslations?: Record<string, string[]>;
}

export const initialAppState: AppState = {
  conjugationGroup: "indicative/present",
  conjugationGroups: ["indicative/present"],
  topCount: 100,
  batchSize: 10,
  verbs: undefined
}


export const appReducers = createReducer(
  initialAppState,
  on(AppActions.setBatchSize, (state, {batchSize}) => ({...state, batchSize})),
  on(AppActions.setTopCount, (state, {topCount}) => ({...state, topCount})),
  on(AppActions.setBatchData, (state, {verbs}) => ({...state, verbs: verbs, verbsConj: undefined, verbsTranslations: undefined})),
  on(AppActions.setVerbsData, (state, {verbsConj, verbsTranslations}) => ({...state, verbsConj, verbsTranslations}))
);

