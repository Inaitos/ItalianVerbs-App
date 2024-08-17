import {createActionGroup, emptyProps, props} from "@ngrx/store";

export const AppActions = createActionGroup({
  source:'App',
  events:{
    'Set top count': props<{topCount: number}>(),
    'Set batch size': props<{batchSize: number}>(),
    'Set batch data': props<{verbs: string[]}>(),
    'Load next batch': emptyProps(),
    'Init if empty': emptyProps(),
    'Set verbs data': props<{verbsConj: Record<string, Record<string, string>>, verbsTranslations: Record<string, string[]>}>(),
    'Load verbs data': emptyProps(),
    'Do Nothing': emptyProps(),
  }
});

