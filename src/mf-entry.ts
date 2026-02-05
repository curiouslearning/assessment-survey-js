// src/mf-entry.ts
import { App } from "./App";
import { UIController } from "./ui/uiController";

let appInstance: App | null = null;

export function mount(container: HTMLElement, props: any = {}) {
  console.log('MF Entry mount called with props:', props);
  (window as any).__ASSESSMENT_MF__ = true;
  const baseUrl = props.baseUrl || '';
  console.log('Using baseUrl:', baseUrl);

  UIController.InjectDOM(container, baseUrl);

  appInstance = new App();
  appInstance.spinUp(baseUrl);
}

export function unmount() {
  if (appInstance) {
    appInstance = null;
  }
}

