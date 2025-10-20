export function isDefinedAs(typeName: string, val?: unknown): void {
  expect(val).toBeDefined()
  expect(typeof val).toBe(typeName)
}
