import {SecurityContext} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

export function adjustHtmlTranslation(sanitizer: DomSanitizer, text: string): string {
  return sanitizer.sanitize(SecurityContext.HTML, text.replace("\n", "<br>")) ?? '';
}

export function removeFirstBrackets(s: string): string {
  if (!s) {
    return '';
  }
  let bracket = 0;
  for(let i=0;i<s.length;i++) {
    switch (s[i]) {
      case ' ':
        continue;
      case '(':
        bracket++;
        continue;
      case ')':
        if (bracket == 0) {
          return s;
        }
        bracket--;
        if (bracket > 0) {
          continue;
        }
        i++;
        break;
      default:
        if (bracket > 0) {
          continue;
        }
        break;
    }
    return s.substring(i).trim();
  }
  return s;
}
