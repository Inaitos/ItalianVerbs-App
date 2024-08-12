import {Definition, DtoConjugation} from "../api/verbs";

export interface WordInfoDialogInitData {
  definition: Definition;
  conjugations: Record<string, DtoConjugation[]>;
}
