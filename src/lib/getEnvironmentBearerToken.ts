export function getEnvironmentBearerToken(
  environment?: Environment,
  useKey = false,
): string {
  const token = environment?.variables.find(
    (variable) =>
      variable.enabled && /token/i.test(variable.key) && variable.value.trim(),
  )

  if (!token) return ""
  return useKey ? `{{${token.key.trim()}}}` : token.value
}
