import {createActionGroup, emptyProps, props} from "@ngrx/store";

export const Actions = createActionGroup({
  source:'App',
  events:{
    'Set top count': props<{topCount: number}>(),
    'Set batch size': props<{batchSize: number}>(),
    'Load next batch': emptyProps()
  }
});

