import {Injectable} from "@angular/core";
import {filter, map, Observable, shareReplay} from "rxjs";
import {Definition, DtoConjugation, DtoTranslation, ItalianVerbsService} from "./verbs";

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

  private filterTranslation(t: DtoTranslation): boolean {
    switch (t.translation)  {
      case "Extended meanings":
      case "Figurative meanings":
        return false;
    }
    return true;
  }

  getWordTranslations(word: string): Observable<DtoTranslation[]> {
    return this.api.getTranslation(word).pipe(map(tt => tt.filter(t => this.filterTranslation(t))));
  }

  getWordsBatch(topCount: number, batchSize: number): Observable<string[]>{
    return this.api.getRandom(topCount, batchSize).pipe(shareReplay());
  }

  getWordsCount(): Observable<number>{
    return this.api.getLength();
  }
}
