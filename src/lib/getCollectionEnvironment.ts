import { disableDuplicateVariables } from "./disableDuplicateVariables"

export function getCollectionEnvironment(
  collection: PostmanCollection,
  collectionId: string,
): Environment {
  return {
    id: `collection:${collectionId}`,
    name: collection.info.name,
    kind: "collection",
    collectionId,
    active: false,
    variables: disableDuplicateVariables(
      (collection.variable ?? []).map((variable) => ({
        id: crypto.randomUUID(),
        key: variable.key ?? "",
        value:
          typeof variable.value === "string"
            ? variable.value
            : variable.value == null
              ? ""
              : JSON.stringify(variable.value),
        type:
          variable.type === "secret" ||
          /token|secret|password|api.?key/i.test(variable.key ?? "")
            ? "secret"
            : "text",
        enabled: !variable.disabled,
        description:
          typeof variable.description === "string"
            ? variable.description
            : (variable.description?.content ?? ""),
        visible: false,
      })),
    ),
  }
}
