import {SecurityContext} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

export function adjustHtmlTranslation(sanitizer: DomSanitizer, text: string): string {
  return sanitizer.sanitize(SecurityContext.HTML, text.replace("\n", "<br>")) ?? '';
}

export function getPersonText(person: string): string {
  switch (person) {
    case 's1':
      return 'Io';
    case 's2':
      return 'Tu';
    case 's3':
      return 'Lui/Lei';
    case 'p1':
      return 'Noi';
    case 'p2':
      return 'Voi';
    case 'p3':
      return 'Loro';
  }
  throw new Error("Unknown person " + person);
}
