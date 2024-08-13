import {createReducer, on} from "@ngrx/store";
import {AppActions} from "./app.state.actions"

export interface AppState {
  verbs?: string[],
  topCount: number,
  batchSize: number,
  conjugationGroup: string,
  conjugationGroups: string[]
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
  on(AppActions.setBatchData, (state, {words}) => ({...state, verbs: words})),
);

