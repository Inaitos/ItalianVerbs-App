import {Component, OnInit, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {PanelModule} from "primeng/panel";
import {Button} from "primeng/button";
import {AppActions} from "../../state/app.state.actions";
import {ObserveVerbsData} from "../../state/app.state.selectors";
import {DialogService} from "primeng/dynamicdialog";
import {WordinfodialogComponent} from "../../wordinfodialog/wordinfodialog.component";
import {WordInfoDialogInitData} from "../../wordinfodialog/wordinfodialogdata";

@Component({
  selector: 'app-train-conjugations',
  standalone: true,
  imports: [
    PanelModule,
    Button
  ],
  templateUrl: './train-conjugations.component.html',
  styleUrl: './train-conjugations.component.scss'
})
export class TrainConjugationsComponent implements OnInit{
  protected currentVerb = signal<string|undefined>(undefined);
  protected translations = signal<string[]|undefined>(undefined);
  protected conj = signal<Record<string, string>|undefined>(undefined);

  private verbs?: string[];
  private verbIndex?: number = undefined;
  private verbsTranslations?: Record<string, string[]>;
  private verbsConj?: Record<string, Record<string, string>>;

  constructor(private store: Store, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.initIfEmpty());
    ObserveVerbsData(this.store).subscribe(init => {
      this.verbs = init.verbs;
      this.verbsTranslations = init.verbsTranslations;
      this.verbsConj = init.verbsConj;
      this.verbIndex = undefined;
      this.getNextVerb();
    });
  }

  getNextVerb() {
    if (this.verbs == null) {
      throw new Error("Verbs not found");
    }
    this.verbIndex = this.verbIndex !== undefined ? (this.verbIndex + 1) % this.verbs?.length! : 0;
    const verb = this.verbs[this.verbIndex];
    this.currentVerb.set(verb);
    const trans = this.verbsTranslations?.[verb];
    this.translations.set(trans);

    const conj = this.verbsConj?.[verb];
    this.conj.set(conj);
  }

  get verbIndexText(): string {
    if (this.verbIndex == undefined) {
      return '';
    }
    return `${this.verbIndex!+1} / ${this.verbs?.length}`
  }

  showWordInfo() {
    const ref = this.dialogService.open(WordinfodialogComponent, {
      data: <WordInfoDialogInitData>{
        verb: this.currentVerb()
      },
      header: this.currentVerb(),
    });
    ref.onClose.subscribe();
  }
}
