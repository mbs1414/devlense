import type { ReactNode } from "react"
import { useDefaultLayout } from "react-resizable-panels"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"

const panelIds = ["request-collections", "request-editor"]

export default function CollectionsSplitPanels({
  collections,
  children,
  layoutId = "devlens-request-panels",
  fillHeight = false,
}: {
  collections: ReactNode
  children: ReactNode
  layoutId?: string
  fillHeight?: boolean
}) {
  const isStacked = useIsMobile(1280)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: layoutId,
    panelIds,
    onlySaveAfterUserInteractions: true,
  })

  if (isStacked) {
    return (
      <div className="flex min-w-0 flex-col gap-4">
        {collections}
        {children}
      </div>
    )
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      className={fillHeight ? "min-h-0 flex-1" : undefined}
      style={fillHeight ? undefined : { overflow: "visible" }}
    >
      <ResizablePanel
        id={panelIds[0]}
        defaultSize="33%"
        minSize={240}
        maxSize="45%"
        style={fillHeight ? undefined : { overflow: "visible" }}
      >
        {collections}
      </ResizablePanel>
      <ResizableHandle
        withHandle
        stickyHandle={!fillHeight}
        className="w-4 bg-transparent"
        aria-label="Resize collections panel"
      />
      <ResizablePanel
        id={panelIds[1]}
        defaultSize="67%"
        minSize={400}
        style={fillHeight ? undefined : { overflow: "visible" }}
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
