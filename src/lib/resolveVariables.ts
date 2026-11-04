type Variable = Pick<EnvironmentVariable, "key" | "value" | "enabled">

export function resolveVariables(
  text: string,
  variables: Variable[],
  resolving: string[] = [],
): string {
  return text.replace(/{{\s*([^{}]+?)\s*}}/g, (_placeholder, name: string) => {
    const key = name.trim()
    const variable = variables.findLast(
      (variable) => variable.enabled && variable.key.trim() === key,
    )

    if (!variable) {
      throw new Error(`Variable "${key}" is not defined or is disabled.`)
    }

    if (resolving.includes(key)) {
      throw new Error(`Circular variable reference: "${key}".`)
    }

    return resolveVariables(variable.value, variables, [...resolving, key])
  })
}
