"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { exportLeadsCSV } from "@/app/actions/leads";
import { WhatsAppDraftDialog } from "./whatsapp-draft-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Phone,
  MessageSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Lead, LeadStage, LeadSource, PaginatedResult } from "@/lib/types";

interface LeadsTableViewProps {
  initialData: PaginatedResult<Lead>;
  currentStage?: string;
  currentSource?: string;
  currentSearch?: string;
}

const STAGE_CONFIG: Record<LeadStage, { label: string; color: string }> = {
  new: { label: "New Enquiry", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  contacted: { label: "Contacted", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" },
  interested: { label: "Interested", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20" },
  appointment_booked: { label: "Appt Booked", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  attended: { label: "Attended Clinic", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20" },
  treatment_proposed: { label: "Treatment Plan", color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20" },
  won: { label: "Won / Treated", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
  lost: { label: "Lost Enquiry", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20" },
};

export function LeadsTableView({
  initialData,
  currentStage = "all",
  currentSource = "all",
  currentSearch = "",
}: LeadsTableViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [stage, setStage] = useState(currentStage);
  const [source, setSource] = useState(currentSource);
  const [exporting, setExporting] = useState(false);

  // WhatsApp Dialog State
  const [whatsappLead, setWhatsappLead] = useState<{ id: string; name: string; phone: string } | null>(null);

  function applyFilters(newStage?: string, newSource?: string, newSearch?: string) {
    const params = new URLSearchParams(searchParams.toString());
    const s = newStage !== undefined ? newStage : stage;
    const src = newSource !== undefined ? newSource : source;
    const q = newSearch !== undefined ? newSearch : search;

    if (s && s !== "all") params.set("stage", s);
    else params.delete("stage");

    if (src && src !== "all") params.set("source", src);
    else params.delete("source");

    if (q) params.set("search", q);
    else params.delete("search");

    params.set("page", "1");
    router.push(`/leads?${params.toString()}`);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const csv = await exportLeadsCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `molarmetric_enquiries_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/leads?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, phone, or email..."
              className="pl-9 text-xs sm:text-sm h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters(undefined, undefined, search);
                }
              }}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-9 px-3 text-xs"
            onClick={() => applyFilters(undefined, undefined, search)}
          >
            Search
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Source Filter */}
          <Select
            value={source}
            onValueChange={(val) => {
              setSource(val);
              applyFilters(undefined, val, undefined);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="walk_in">Walk-in</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>

          {/* Export CSV Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs whitespace-nowrap"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stage Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            setStage("all");
            applyFilters("all", undefined, undefined);
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
            stage === "all"
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All ({initialData.total})
        </button>
        {Object.entries(STAGE_CONFIG).map(([stgKey, config]) => (
          <button
            key={stgKey}
            onClick={() => {
              setStage(stgKey);
              applyFilters(stgKey, undefined, undefined);
            }}
            className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              stage === stgKey
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {initialData.data.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-foreground">No patient enquiries found.</p>
            <p className="text-xs mt-1">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-xs">Patient Details</TableHead>
                <TableHead className="font-semibold text-xs">Channel</TableHead>
                <TableHead className="font-semibold text-xs">Pipeline Stage</TableHead>
                <TableHead className="font-semibold text-xs">Interest / Procedure</TableHead>
                <TableHead className="font-semibold text-xs">Created</TableHead>
                <TableHead className="text-right font-semibold text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.data.map((lead) => {
                const stageInfo = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.new;

                return (
                  <TableRow key={lead.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell>
                      <div>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors"
                        >
                          {lead.name}
                        </Link>
                        <div className="font-mono text-xs text-muted-foreground mt-0.5">
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="capitalize text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-foreground">
                        {lead.source.replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] font-semibold ${stageInfo.color}`}>
                        {stageInfo.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground truncate max-w-[180px] block">
                        {lead.service_interest || "General Consultation"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Call Patient"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() =>
                            setWhatsappLead({
                              id: lead.id,
                              name: lead.name,
                              phone: lead.phone,
                            })
                          }
                          className="p-1.5 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 transition-colors"
                          title="WhatsApp Template"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination Bar */}
        {initialData.totalPages > 1 && (
          <div className="p-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Page {initialData.page} of {initialData.totalPages} ({initialData.total} enquiries)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => handlePageChange(initialData.page - 1)}
                disabled={initialData.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => handlePageChange(initialData.page + 1)}
                disabled={initialData.page >= initialData.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Dialog */}
      {whatsappLead && (
        <WhatsAppDraftDialog
          leadId={whatsappLead.id}
          leadName={whatsappLead.name}
          leadPhone={whatsappLead.phone}
          open={!!whatsappLead}
          onOpenChange={(open) => !open && setWhatsappLead(null)}
        />
      )}
    </div>
  );
}
