import {AfterViewInit, Component, signal, ViewChild, ViewContainerRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {PanelModule} from "primeng/panel";
import {Button} from "primeng/button";
import {AppActions} from "../../state/app.state.actions";
import {ObserveVerbsData} from "../../state/app.state.selectors";
import {DialogService} from "primeng/dynamicdialog";
import {WordinfodialogComponent} from "../../wordinfodialog/wordinfodialog.component";
import {WordInfoDialogInitData} from "../../wordinfodialog/wordinfodialogdata";
import {GuessConjugationComponent} from "./guess-conjugation/guess-conjugation.component";
import {GuessPersonComponent} from "./guess-person/guess-person.component";

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
export class TrainConjugationsComponent implements AfterViewInit {
  protected currentVerb = signal<string|undefined>(undefined);
  protected translations = signal<string[]|undefined>(undefined);
  protected conj = signal<Record<string, string>|undefined>(undefined);

  private verbs?: string[];
  private verbIndex?: number = undefined;
  private verbsTranslations?: Record<string, string[]>;
  private verbsConj?: Record<string, Record<string, string>>;
  @ViewChild('guessComponent', {read: ViewContainerRef})
  public guessComponent!: ViewContainerRef;

  constructor(private store: Store, private dialogService: DialogService) {
  }

  ngAfterViewInit(): void {
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

    const viewForm = this;
    const view: ViewContainerRef = viewForm.guessComponent;

    view.clear();
    const component =
      this.getRandomInt(2) == 0
        ? view.createComponent(GuessConjugationComponent)
        : view.createComponent(GuessPersonComponent);

    const randomPerson = `${this.getRandomInt(2) == 0 ? "s" : "p"}${this.getRandomInt(3)+1}`;
    component.setInput("person", randomPerson);
    component.setInput("verb", conj?.[randomPerson]);
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
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
