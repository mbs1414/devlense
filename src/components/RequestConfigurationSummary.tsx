import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  requestSummary: string
  submittedUrl: string
}

export default function RequestConfigurationSummary({
  requestSummary,
  submittedUrl,
}: Props) {
  return (
    <Card className="bg-surface">
      <CardHeader>
        <CardTitle className="text-section-title font-semibold">
          Request configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-color-secondary text-body mb-4">{requestSummary}</p>
        <p className="text-color-accent font-mono text-label">{submittedUrl}</p>
      </CardContent>
    </Card>
  )
}
