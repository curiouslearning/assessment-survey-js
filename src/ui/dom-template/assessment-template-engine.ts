import type {
  HostTheme,
  TemplateClassNames,
  TemplateSections,
  TemplateTextOverrides,
} from './assessment-template-contracts';
import { withBase } from './assessment-template-resolvers';

/**
 * Fully-resolved renderer configuration used during DOM generation.
 */
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

/**
 * Shared play icon markup used in the start button.
 */
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

/**
 * Common options for lightweight DOM element creation.
 */
export type ElementOptions = {
  id?: string;
  className?: string;
  text?: string;
  style?: string;
  attrs?: Record<string, string | undefined>;
};

/**
 * Joins class names while removing undefined and empty values.
 */
export function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames.filter((value): value is string => Boolean(value && value.trim())).join(' ');
}

/**
 * Creates an HTML element and applies standard attributes/options.
 */
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

/**
 * Appends only truthy child nodes to avoid repetitive null checks.
 */
export function appendChildren(parent: Node, children: Array<Node | null | undefined>): void {
  for (const child of children) {
    if (child) {
      parent.appendChild(child);
    }
  }
}

/**
 * Returns an inline display style for conditional visibility.
 */
export function hiddenDisplayStyle(isVisible: boolean): string | undefined {
  return isVisible ? undefined : 'display: none';
}

/**
 * Read-only context object shared by section builders.
 */
export class TemplateContext {
  constructor(private readonly config: ResolvedTemplateConfig) {}

  /**
   * Active host theme.
   */
  public get hostTheme(): HostTheme {
    return this.config.hostTheme;
  }

  /**
   * Whether stylesheet link injection is enabled.
   */
  public get includeStylesheetLink(): boolean {
    return this.config.includeStylesheetLink;
  }

  /**
   * Relative stylesheet path used by the renderer.
   */
  public get stylesheetPath(): string {
    return this.config.stylesheetPath;
  }

  /**
   * Visibility switches for optional UI sections.
   */
  public get sections(): TemplateSections {
    return this.config.sections;
  }

  /**
   * Text labels used by generated UI nodes.
   */
  public get text(): TemplateTextOverrides {
    return this.config.text;
  }

  /**
   * Class-name mapping applied during render.
   */
  public get classNames(): TemplateClassNames {
    return this.config.classNames;
  }

  /**
   * Resolves an asset URL using the normalized base URL rules.
   */
  public resolveAsset(path: string): string {
    return withBase(this.config.assetBaseUrl, path, this.config.rootRelativeAssetPaths);
  }
}

/**
 * Base class for a renderable template section.
 */
export abstract class TemplateSection<T extends Node = HTMLElement> {
  constructor(protected readonly context: TemplateContext) {}

  /**
   * Builds and returns the section root node.
   */
  public abstract render(): T;
}
