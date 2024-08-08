import {Component, Signal, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button, ButtonDirective} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {SelectButtonModule} from "primeng/selectbutton";
import {CommonModule} from "@angular/common";
import {AutoCompleteModule} from "primeng/autocomplete";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {Word} from "./model/word";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, switchMap} from "rxjs";
import {VerbsApi} from "./api/verbs-api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonDirective, Button, MenuModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule, MenubarModule, SelectButtonModule, AutoCompleteModule, OverlayPanelModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected searchWord = signal('');
  protected searchWords: Signal<Word[] | undefined>;

  protected menuItems: MenuItem[] = [
    {
      label: "Conjugation",
      items: [
        {
          label: 'Next'
        }
      ]
    }
  ];
  protected wordsSelectionOptions = [
    { label: 'Top 100', value: '100' },
    { label: 'Top 1000', value: '1000' },
    { label: 'All (12436)', value: 'all' }
  ];

  protected wordsSelection: string = '100';

  constructor(api: VerbsApi) {
    const searchWords$= toObservable(this.searchWord)
      .pipe(
        debounceTime(1000),
        switchMap(s => api.getWords(s))
      );
    this.searchWords = toSignal(searchWords$);
  }

  onSearchTextChanged(searchWordPanel: OverlayPanel, searchInput: HTMLInputElement) {
    if (!searchWordPanel.overlayVisible && !!this.searchWord || searchWordPanel.overlayVisible && !this.searchWord) {
      searchWordPanel.toggle(null, searchInput);
    }

  }
}
