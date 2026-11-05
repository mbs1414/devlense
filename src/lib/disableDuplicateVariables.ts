export function disableDuplicateVariables(
  variables: EnvironmentVariable[],
): EnvironmentVariable[] {
  return variables.map((variable, index) => {
    const key = variable.key.trim()
    if (!variable.enabled || !key) return variable

    const hasDuplicate = variables
      .slice(index + 1)
      .some((other) => other.enabled && other.key.trim() === key)

    return hasDuplicate ? { ...variable, enabled: false } : variable
  })
}
