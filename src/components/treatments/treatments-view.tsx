"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateTreatmentOpportunity } from "@/app/actions/treatments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  XCircle,
  Clock,
  Loader2,
  Plus,
} from "lucide-react";
import type { TreatmentOpportunity, OpportunityStatus } from "@/lib/types";
import { formatCurrency, safePercentage } from "@/lib/utils";
import { NewOpportunityDialog, type LeadOption } from "./new-opportunity-dialog";

interface TreatmentsViewProps {
  initialOpportunities: TreatmentOpportunity[];
  leadsList?: LeadOption[];
}

const STATUS_CONFIG: Record<OpportunityStatus, { label: string; color: string }> = {
  proposed: { label: "Proposed", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  pending_decision: { label: "Pending Decision", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  accepted: { label: "Accepted", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
  partially_collected: { label: "Partially Paid", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20" },
  collected: { label: "Fully Collected", color: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-200 border-emerald-600/30" },
  declined: { label: "Declined", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function TreatmentsView({ initialOpportunities, leadsList }: TreatmentsViewProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<OpportunityStatus | "all">("all");
  const [selectedOpp, setSelectedOpp] = useState<TreatmentOpportunity | null>(null);
  const [newOppOpen, setNewOppOpen] = useState(false);

  // Update dialog states
  const [actionType, setActionType] = useState<"collect" | "accept" | "decline" | null>(null);
  const [collectedAmount, setCollectedAmount] = useState("");
  const [lossReason, setLossReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Aggregated totals
  const totalProposed = initialOpportunities.reduce((acc, o) => acc + o.proposed_value, 0);
  const totalAccepted = initialOpportunities.reduce((acc, o) => acc + (o.accepted_value || 0), 0);
  const totalCollected = initialOpportunities.reduce((acc, o) => acc + (o.collected_amount || 0), 0);
  const acceptedCount = initialOpportunities.filter((o) =>
    ["accepted", "collected", "partially_collected"].includes(o.status)
  ).length;
  const acceptanceRate = Math.round(safePercentage(acceptedCount, initialOpportunities.length));

  const filtered = filter === "all"
    ? initialOpportunities
    : initialOpportunities.filter((o) => o.status === filter);

  async function handleActionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOpp || !actionType) return;
    setLoading(true);

    if (actionType === "collect") {
      const added = parseFloat(collectedAmount) || 0;
      const newTotal = (selectedOpp.collected_amount || 0) + added;
      const targetVal = selectedOpp.accepted_value || selectedOpp.proposed_value;
      const newStatus = newTotal >= targetVal ? "collected" : "partially_collected";

      await updateTreatmentOpportunity(selectedOpp.id, {
        status: newStatus,
        collected_amount: newTotal,
      });
    } else if (actionType === "accept") {
      await updateTreatmentOpportunity(selectedOpp.id, {
        status: "accepted",
        accepted_value: selectedOpp.proposed_value,
      });
    } else if (actionType === "decline") {
      await updateTreatmentOpportunity(selectedOpp.id, {
        status: "declined",
        loss_reason: lossReason || "Patient declined treatment",
      });
    }

    setLoading(false);
    setActionType(null);
    setSelectedOpp(null);
    setCollectedAmount("");
    setLossReason("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Top Financial Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs font-semibold text-muted-foreground block">
            Proposed Opportunities
          </span>
          <span className="text-xl sm:text-2xl font-bold text-foreground mt-0.5 block">
            {formatCurrency(totalProposed)}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <span className="text-xs font-semibold text-primary block">
            Accepted Treatment Value
          </span>
          <span className="text-xl sm:text-2xl font-bold text-foreground mt-0.5 block">
            {formatCurrency(totalAccepted)}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">
            Realized Collections
          </span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5 block">
            {formatCurrency(totalCollected)}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs font-semibold text-muted-foreground block">
            Case Acceptance Rate
          </span>
          <span className="text-xl sm:text-2xl font-bold text-foreground mt-0.5 block">
            {acceptanceRate}%
          </span>
        </div>
      </div>

      {/* Filter Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            All ({initialOpportunities.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const count = initialOpportunities.filter((o) => o.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key as OpportunityStatus)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  filter === key
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs shadow-xs self-start sm:self-auto whitespace-nowrap"
          onClick={() => setNewOppOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Propose Treatment Plan</span>
        </Button>
      </div>

      {/* Opportunities List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm border border-border/60 rounded-xl bg-card">
          <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="font-semibold text-foreground">No treatment plans found in this status.</p>
          <p className="text-xs mt-1">Propose treatment plans from patient enquiry profiles or create a new plan.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 text-xs gap-1.5"
            onClick={() => setNewOppOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Propose First Treatment Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((opp) => {
            const statusConfig = STATUS_CONFIG[opp.status] || STATUS_CONFIG.proposed;
            const remaining = (opp.accepted_value || opp.proposed_value) - (opp.collected_amount || 0);

            return (
              <Card key={opp.id} className="border-border/60 hover:border-border transition-all">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/leads/${opp.lead_id}`}
                        className="font-bold text-base text-foreground hover:text-primary transition-colors"
                      >
                        {opp.lead?.name || "Patient"}
                      </Link>
                      <Badge variant="outline" className={`text-[10px] font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {opp.service_category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Proposed: <span className="font-semibold text-foreground">{formatCurrency(opp.proposed_value)}</span>
                      </span>
                      {opp.accepted_value && (
                        <span className="text-muted-foreground">
                          Accepted: <span className="font-semibold text-primary">{formatCurrency(opp.accepted_value)}</span>
                        </span>
                      )}
                      <span className="text-emerald-600 font-semibold">
                        Collected: {formatCurrency(opp.collected_amount)}
                      </span>
                      {remaining > 0 && opp.status !== "declined" && (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">
                          Remaining: {formatCurrency(remaining)}
                        </span>
                      )}
                    </div>

                    {opp.loss_reason && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg mt-1">
                        Decline reason: {opp.loss_reason}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                    {opp.status !== "collected" && opp.status !== "declined" && (
                      <Button
                        size="sm"
                        className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => {
                          setSelectedOpp(opp);
                          setActionType("collect");
                        }}
                      >
                        <IndianRupee className="h-3.5 w-3.5" />
                        Record Payment
                      </Button>
                    )}

                    {opp.status === "proposed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                          setSelectedOpp(opp);
                          setActionType("accept");
                        }}
                      >
                        Accept Plan
                      </Button>
                    )}

                    {opp.status !== "declined" && opp.status !== "collected" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setSelectedOpp(opp);
                          setActionType("decline");
                        }}
                      >
                        Declined
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "collect" && "Record Payment Collection"}
              {actionType === "accept" && "Accept Treatment Plan"}
              {actionType === "decline" && "Record Treatment Decline"}
            </DialogTitle>
            <DialogDescription>
              Patient: <span className="font-semibold text-foreground">{selectedOpp?.lead?.name}</span> ({selectedOpp?.service_category})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleActionSubmit} className="space-y-4">
            {actionType === "collect" && (
              <div className="space-y-1.5">
                <Label htmlFor="collected">Amount Collected Now (INR ₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="collected"
                    type="number"
                    min="1"
                    placeholder="e.g. 15000"
                    className="pl-9 font-mono"
                    value={collectedAmount}
                    onChange={(e) => setCollectedAmount(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Current collected: {formatCurrency(selectedOpp?.collected_amount || 0)} of {formatCurrency(selectedOpp?.accepted_value || selectedOpp?.proposed_value || 0)}
                </p>
              </div>
            )}

            {actionType === "accept" && (
              <p className="text-sm text-muted-foreground">
                Confirm that patient agreed to the proposed estimate of{" "}
                <span className="font-bold text-foreground">
                  {formatCurrency(selectedOpp?.proposed_value || 0)}
                </span>
                . This will update the pipeline status to &ldquo;Won / Accepted&rdquo;.
              </p>
            )}

            {actionType === "decline" && (
              <div className="space-y-1.5">
                <Label htmlFor="declineReason">Reason for Patient Decline</Label>
                <Input
                  id="declineReason"
                  placeholder="e.g. Cost barrier, seeking second opinion, moving city"
                  value={lossReason}
                  onChange={(e) => setLossReason(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setActionType(null)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Opportunity Dialog */}
      <NewOpportunityDialog
        leads={leadsList}
        open={newOppOpen}
        onOpenChange={setNewOppOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
