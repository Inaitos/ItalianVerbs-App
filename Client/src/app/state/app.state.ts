import {createReducer, on} from "@ngrx/store";
import {Actions} from "./app.state.actions"

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
  on(Actions.setBatchSize, (state, {batchSize}) => ({...state, batchSize})),
  on(Actions.setTopCount, (state, {topCount}) => ({...state, topCount})),
);

