import {Injectable} from "@angular/core";
import {Observable, shareReplay} from "rxjs";
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

  getWordsBatch(topCount: number, batchSize: number): Observable<string[]>{
    return this.api.getRandom(topCount, batchSize).pipe(shareReplay());
  }

  getWordsCount(): Observable<number>{
    return this.api.getLength();
  }
}
