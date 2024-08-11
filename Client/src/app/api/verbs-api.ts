import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Definition, DtoConjugation, ItalianVerbsService} from "./verbs";

@Injectable({
  providedIn: 'root'
})
export class VerbsApi {
  constructor(private api: ItalianVerbsService) {

  }
  getWordsFromApi(search: string): Observable<string[]> {
    return this.api.getWords(search);
  }

  getWordInfo(word: string): Observable<Definition> {
    return this.api.getWord(word);
  }

  getWordConjugations(word: string, group: string): Observable<DtoConjugation[]> {
    return this.api.getConj(word, group);
  }
}
