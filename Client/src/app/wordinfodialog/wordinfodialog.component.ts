import {Component, OnInit, SecurityContext, signal} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {WordInfoDialogInitData} from "./wordinfodialogdata";
import {NgForOf} from "@angular/common";
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {DomSanitizer} from "@angular/platform-browser";
import {VerbsApi} from "../api/verbs-api";
import {map, switchMap, withLatestFrom, zip} from "rxjs";
import {Store} from "@ngrx/store";
import {selectConj, selectVerbs} from "../state/app.state.selectors";
import {adjustHtmlTranslation, removeFirstBrackets} from "../utils/string-helpers";
import {DtoConjugation} from "../api/verbs";

@Component({
  selector: 'app-wordinfodialog',
  standalone: true,
  imports: [
    NgForOf,
    PanelModule,
    CardModule
  ],
  templateUrl: './wordinfodialog.component.html',
  styleUrl: './wordinfodialog.component.scss'
})
export class WordinfodialogComponent implements OnInit{
  protected cj = signal<Record<string, string>|undefined>(undefined);
  protected translations = signal<string[]|undefined>(undefined)
  protected verb: string;

  constructor(private ref: DynamicDialogRef,
              config: DynamicDialogConfig,
              private sanitizer: DomSanitizer,
              private api: VerbsApi,
              private store: Store
              ) {
    const initData = <WordInfoDialogInitData>config.data;
    this.verb = initData.verb;
  }

  ngOnInit(): void {
    this.store.select(selectConj).pipe(
      switchMap(conjCfg =>
        zip(
          this.api.getWordInfo(this.verb),
          this.api.getWordConjugations(this.verb, conjCfg.group)
        ).pipe(
          map(wordData => ({translations: wordData[0].definitions, conjugations: wordData[1]}))
        )
      )
    ).subscribe(data => {
      console.log("Data ready", data);
      this.translations.set(data.translations?.map(t => removeFirstBrackets(adjustHtmlTranslation(this.sanitizer, t))) ?? []);
      const conj = this.toConjugationsDct(data.conjugations);
      this.cj.set(conj);
    });
  }

  toConjugationsDct(conj: DtoConjugation[]): Record<string, string> {
    const ret = conj.reduce<Record<string, string>>( (map, el) => {map[el.form!] = el.shortValue!; return map;}, {});
    return ret;
  }
}
