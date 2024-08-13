import {createActionGroup, emptyProps, props} from "@ngrx/store";

export const AppActions = createActionGroup({
  source:'App',
  events:{
    'Set top count': props<{topCount: number}>(),
    'Set batch size': props<{batchSize: number}>(),
    'Set batch data': props<{words: string[]}>(),
    'Load next batch': emptyProps(),
    'Init if empty': emptyProps(),
    'Do Nothing': emptyProps(),
  }
});

