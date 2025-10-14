function mapErrorsToString(errors) {
  return errors.reduce((acc, { constraints, children }) => {
    if (constraints) {
      const errorsArray = Object.values(constraints)
      if (errorsArray.length) acc += errorsArray.join(', ') + ', '
    }

    if (children?.length) acc += mapErrorsToString(children)

    return acc
  }, '')
}

export function createErrorString(errors) {
  const defaultError = 'Bad Request'
  try {
    const errorString = mapErrorsToString(errors)
    if (errorString) {
      return errorString.replace(/, $/, '.')
    }
    return defaultError
  } catch {
    return defaultError
  }
}
