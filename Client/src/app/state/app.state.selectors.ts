import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AppState} from "./app.state";

export const selectAppState = createFeatureSelector<AppState>('app');
export const selectVerbs = createSelector(selectAppState, state => state.verbs);
export const selectTopCount = createSelector(selectAppState, state => state?.topCount ?? 999);
export const selectBatchSettings = createSelector(selectAppState, state => ({topCount: state.topCount, batch: state.batchSize}));
