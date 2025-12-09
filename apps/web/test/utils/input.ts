export function getInput(container: HTMLElement, selector: string): Element {
  const input = container.querySelector(selector)

  if (!input) {
    throw new Error(`Cannot find element with selector: ${selector}`)
  }

  return input
}
