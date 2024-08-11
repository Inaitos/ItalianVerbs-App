import {Component, SecurityContext} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Definition, DtoConjugation} from "../api/verbs";
import {WordInfoDialogInitData} from "./wordinfodialogdata";
import {NgForOf} from "@angular/common";
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {DomSanitizer} from "@angular/platform-browser";

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
export class WordinfodialogComponent {
  private definition: Definition;
  private group = "indicative/present";
  private conjugations: Record<string, DtoConjugation[]>;
  constructor(private ref: DynamicDialogRef,
              config: DynamicDialogConfig,
              private sanitizer: DomSanitizer
              ) {
    const initData = <WordInfoDialogInitData>config.data;
    this.definition = initData.definition;
    this.conjugations = initData.conjugations;
  }

  get Translations(): string[] {
    return this.definition.definitions?.map(d => d.replace("\n", "<br>")) ?? [];
  }

  get TranslationHtmls(): string[] {
    return this.definition.definitions?.map(d => this.sanitizer.sanitize(SecurityContext.HTML, d.replace("\n", "<br>"))).filter(d => !!d).map(d => d!) ?? [];
  }


  get ConjGroup() {
    return this.group;
  }

  get ConjAvailable() {
    return !!this.conjugations[this.ConjGroup];
  }

  Conj(person: number, number: number) {
    const conj = this.conjugations[this.ConjGroup];
    if (!conj) {
      return undefined;
    }
    let form = (number == 1 ? "s" : "p") + person.toString();
    const ret = conj.find(c => c.form == form)?.shortValue;
    console.log(`Conj ${person}/${number}: ${form} = ${ret}`)
    return ret;
  }
}
