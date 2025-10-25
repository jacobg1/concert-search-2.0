export const logMockRequest = ({
  request: { method, url },
}: {
  request: Request
}) => {
  console.log('MSW intercepted:', method, url)
}
