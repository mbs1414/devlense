export function getRequestVariables(
  environments: Environment[],
  collectionId: string,
): EnvironmentVariable[] {
  const collectionEnvironment = environments.find(
    (environment) =>
      environment.kind === "collection" &&
      environment.collectionId === collectionId,
  )
  const activeEnvironment = environments.find(
    (environment) => environment.active,
  )

  return [
    ...(collectionEnvironment?.variables ?? []),
    ...(activeEnvironment?.variables ?? []),
  ]
}
