export function disableDuplicateVariables(
  variables: EnvironmentVariable[],
): EnvironmentVariable[] {
  const token =
    variables.find(
      (variable) =>
        variable.enabled &&
        /token/i.test(variable.key) &&
        variable.value.trim(),
    ) ??
    variables.find(
      (variable) => variable.enabled && /token/i.test(variable.key),
    )

  return variables.map((variable, index) => {
    const key = variable.key.trim()
    if (!variable.enabled || !key) return variable

    if (/token/i.test(key)) {
      return variable.id === token?.id
        ? variable
        : { ...variable, enabled: false }
    }

    const hasDuplicate = variables
      .slice(index + 1)
      .some((other) => other.enabled && other.key.trim() === key)

    return hasDuplicate ? { ...variable, enabled: false } : variable
  })
}
