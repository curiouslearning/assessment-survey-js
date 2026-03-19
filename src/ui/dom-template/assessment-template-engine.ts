import type {
  HostTheme,
  TemplateClassNames,
  TemplateSections,
  TemplateTextOverrides,
} from './assessment-template-contracts';
import { withBase } from './assessment-template-resolvers';

export type ResolvedTemplateConfig = {
  assetBaseUrl: string;
  hostTheme: HostTheme;
  includeStylesheetLink: boolean;
  stylesheetPath: string;
  rootRelativeAssetPaths: boolean;
  sections: TemplateSections;
  text: TemplateTextOverrides;
  classNames: TemplateClassNames;
};

export const START_BUTTON_ICON_SVG = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 18L15 12L9 6V18Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
`;

export type ElementOptions = {
  id?: string;
  className?: string;
  text?: string;
  style?: string;
  attrs?: Record<string, string | undefined>;
};

export function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames.filter((value): value is string => Boolean(value && value.trim())).join(' ');
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementOptions = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.id) {
    element.id = options.id;
  }

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.style) {
    element.setAttribute('style', options.style);
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      if (value !== undefined) {
        element.setAttribute(name, value);
      }
    }
  }

  return element;
}

export function appendChildren(parent: Node, children: Array<Node | null | undefined>): void {
  for (const child of children) {
    if (child) {
      parent.appendChild(child);
    }
  }
}

export function hiddenDisplayStyle(isVisible: boolean): string | undefined {
  return isVisible ? undefined : 'display: none';
}

export class TemplateContext {
  constructor(private readonly config: ResolvedTemplateConfig) {}

  public get hostTheme(): HostTheme {
    return this.config.hostTheme;
  }

  public get includeStylesheetLink(): boolean {
    return this.config.includeStylesheetLink;
  }

  public get stylesheetPath(): string {
    return this.config.stylesheetPath;
  }

  public get sections(): TemplateSections {
    return this.config.sections;
  }

  public get text(): TemplateTextOverrides {
    return this.config.text;
  }

  public get classNames(): TemplateClassNames {
    return this.config.classNames;
  }

  public resolveAsset(path: string): string {
    return withBase(this.config.assetBaseUrl, path, this.config.rootRelativeAssetPaths);
  }
}

export abstract class TemplateSection<T extends Node = HTMLElement> {
  constructor(protected readonly context: TemplateContext) {}

  public abstract render(): T;
}
