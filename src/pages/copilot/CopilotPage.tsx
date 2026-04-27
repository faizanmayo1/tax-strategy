import { useState } from "react";
import { Sparkles, Send, FileText, Database, ArrowRight, Lock, Bot, User } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { useToast } from "@/app/providers/ToastProvider";
import { sampleCopilotThread, suggestedPrompts, type CopilotMessage } from "@/mocks/copilot";
import { formatCurrency } from "@/lib/format";

export function CopilotPage() {
  const { toast } = useToast();
  const [thread, setThread] = useState<CopilotMessage[]>(sampleCopilotThread);
  const [input, setInput] = useState("");

  function send(prompt: string) {
    if (!prompt.trim()) return;
    setThread((t) => [...t, { role: "user", content: prompt }]);
    setInput("");
    setTimeout(() => {
      setThread((t) => [
        ...t,
        {
          role: "assistant",
          content:
            "Drafting a one-page brief now. The brief covers Halcyon's three top tax strategies, projected savings, an open question on owner comp benchmarking, and CFO-level cash-flow context for the meeting.",
          citations: [
            { title: "Halcyon Tax Plan v2.1", source: "Generated · 2 hours ago" },
            { title: "Halcyon Q3 Bookkeeping Anomalies", source: "Bookkeeping module" },
          ],
        },
      ]);
      toast({ kind: "ai" as never as "success", title: "Brief ready", description: "1-page advisory brief saved to Reports" });
    }, 600);
  }

  return (
    <div className="px-8 py-7 max-w-[1480px] mx-auto">
      <PageHeader
        title="Aragon Copilot"
        subtitle="Internal AI research assistant trained on firm playbooks, client data, and approved knowledge"
        meta={
          <div className="flex items-center gap-2 mt-1.5">
            <Badge tone="ai" dot>
              <Sparkles className="h-3 w-3 mr-1" /> Source-linked answers
            </Badge>
            <Badge tone="success" dot>
              <Lock className="h-3 w-3 mr-1" /> Audit log on
            </Badge>
            <Badge tone="neutral">Advisor-only</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <Card padded className="lg:col-span-3 flex flex-col h-[660px]">
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-5">
            {thread.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex items-start gap-3">
                  <Avatar name="Adnan Karim" size="sm" />
                  <div className="bg-ink-50 border border-ink-150 rounded-lg px-4 py-3 max-w-[80%]">
                    <div className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">You</div>
                    <div className="text-[13.5px] text-ink-900 leading-relaxed">{m.content}</div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-ai-gradient flex items-center justify-center text-white shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wide text-ink-400 mb-1">Aragon Copilot</div>
                    <div className="text-[13.5px] text-ink-900 leading-relaxed">{m.content}</div>
                    {m.data?.type === "ranked-clients" && (
                      <div className="mt-3 border border-ink-150 rounded-md overflow-hidden">
                        <table className="w-full text-[12.5px]">
                          <thead className="bg-ink-50">
                            <tr className="text-[11px] uppercase tracking-wider text-ink-400">
                              <th className="text-left px-3 py-2">Client</th>
                              <th className="text-left px-3 py-2">Reason</th>
                              <th className="text-right px-3 py-2">Projected savings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {m.data.rows.map((r, j) => (
                              <tr key={j} className="border-t border-ink-100">
                                <td className="px-3 py-2 font-medium text-ink-900">{r.name}</td>
                                <td className="px-3 py-2 text-ink-500">{r.reason}</td>
                                <td className="px-3 py-2 text-right font-mono tabular text-success-ink">
                                  +{formatCurrency(r.savings, { compact: true })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {m.citations && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.citations.map((c, j) => (
                          <button
                            key={j}
                            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-paper border border-ink-150 text-[11.5px] text-ink-700 hover:bg-ink-50 transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            {c.title}
                            <span className="text-ink-400">· {c.source}</span>
                            <ArrowRight className="h-3 w-3 text-ink-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-ink-100 pt-3 mt-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 border border-ink-200 rounded-md focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about clients, strategies, knowledge base — Cmd+Enter to send"
                  className="w-full px-3 py-2.5 text-[13.5px] bg-transparent outline-none resize-none min-h-[60px] max-h-[160px]"
                />
              </div>
              <Button
                variant="ai"
                size="lg"
                leftIcon={<Send className="h-4 w-4" />}
                onClick={() => send(input || "Draft a one-page brief for tomorrow's Halcyon Roastery meeting")}
              >
                Send
              </Button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-ink-400">
              <Lock className="h-3 w-3" /> Responses are source-linked and audited. Aragon will never answer outside firm-approved
              data.
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Card padded>
            <h3 className="text-h3 text-ink-900 mb-3">Suggested prompts</h3>
            <ul className="space-y-1.5">
              {suggestedPrompts.map((p, i) => (
                <li key={i}>
                  <button
                    onClick={() => send(p)}
                    className="text-left w-full text-[12.5px] text-ink-700 px-2.5 py-2 rounded-md hover:bg-ink-50 transition-colors flex items-start gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-accent-violet shrink-0 mt-0.5" />
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card padded>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-info-ink" />
              <h3 className="text-h3 text-ink-900">Connected sources</h3>
            </div>
            <ul className="space-y-2 text-[12.5px]">
              {[
                { src: "Aragon Internal Playbooks", count: 42, icon: "📘" },
                { src: "Client bookkeeping data", count: 150, icon: "📒" },
                { src: "Prior tax returns", count: 423, icon: "📄" },
                { src: "Industry guides", count: 18, icon: "🧭" },
                { src: "Compliance bulletins", count: 64, icon: "⚖️" },
              ].map((s, i) => (
                <li key={i} className="flex items-center justify-between py-1">
                  <span className="text-ink-700 flex items-center gap-2">
                    <span>{s.icon}</span>
                    {s.src}
                  </span>
                  <span className="font-mono tabular text-ink-400 text-[11.5px]">{s.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padded>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-ink-500" />
              <h3 className="text-h3 text-ink-900">Audit trail</h3>
            </div>
            <p className="text-small text-ink-500 leading-relaxed">
              All Copilot queries and responses are logged with user, timestamp, and citation trail. Visible in Settings →
              Audit log.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
