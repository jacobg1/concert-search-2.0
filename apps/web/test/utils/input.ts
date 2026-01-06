export function getInput(
  container: HTMLElement,
  selector: string
): Element {
  const input = container.querySelector(selector)

  if (!input) {
    throw new Error(`Cannot find element with selector: ${selector}`)
  }

  return input
}

export function getInputText(
  container: HTMLElement,
  selector: string
): string | null {
  const input = getInput(container, selector)
  if (!input.textContent) return null
  return input.textContent
}
