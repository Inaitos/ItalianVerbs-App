import {Component, Input, signal} from '@angular/core';
import {getPersonText} from "../../../utils/string-helpers";
import {Button} from "primeng/button";

@Component({
  selector: 'app-guess-person',
  standalone: true,
  imports: [
    Button
  ],
  templateUrl: './guess-person.component.html',
  styleUrl: './guess-person.component.scss'
})
export class GuessPersonComponent {
  @Input()
  public person?: string;

  @Input()
  public verb?: string;

  protected answerVisible = signal(false)

  get Person(): string {
    return this.person == null ? 'Unknown' : getPersonText(this.person);
  }

  get Verb(): string {
    return this.verb == null ? 'Unknown' : this.verb;
  }

  showAnswer() {
    this.answerVisible.set(true);
  }

}
