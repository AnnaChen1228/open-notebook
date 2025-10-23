'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import { useInsight } from '@/lib/hooks/use-insights'

interface SourceInsightDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  insight?: {
    id: string
    insight_type?: string
    content?: string
    created?: string
  }
}

export function SourceInsightDialog({ open, onOpenChange, insight }: SourceInsightDialogProps) {
  // Ensure insight ID has 'source_insight:' prefix for API calls
  const insightIdWithPrefix = insight?.id
    ? (insight.id.includes(':') ? insight.id : `source_insight:${insight.id}`)
    : ''

  const { data: fetchedInsight, isLoading } = useInsight(insightIdWithPrefix, { enabled: open && !!insight?.id })

  // Use fetched data if available, otherwise fall back to passed-in insight
  const displayInsight = fetchedInsight ?? insight

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col gap-0">
        {/* Header */}
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>Source Insight</span>
            {displayInsight?.insight_type && (
              <Badge variant="outline" className="text-xs uppercase">
                {displayInsight.insight_type}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Content - 可滾動區域 */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
          {/* ↑ -mx-6 px-6 讓滾輪貼邊，內容保持 padding */}
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">Loading insight…</span>
              </div>
            </div>
          ) : displayInsight ? (
            <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none pb-4">
              <ReactMarkdown>{displayInsight.content}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-muted-foreground">No insight selected.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Select an insight from the list to view details
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
