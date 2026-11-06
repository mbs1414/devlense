import "@tanstack/react-router"

declare module "@tanstack/react-router" {
  interface HistoryState {
    requestToOpen?: {
      collectionId: string
      requestPath: string
    }
  }
}
