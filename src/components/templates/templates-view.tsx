"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMessageTemplate, updateMessageTemplate, deleteMessageTemplate } from "@/app/actions/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Plus, Trash2, Edit3, Loader2, Sparkles } from "lucide-react";
import type { MessageTemplate } from "@/lib/types";

interface TemplatesViewProps {
  initialTemplates: MessageTemplate[];
}

const AVAILABLE_VARIABLES = [
  { key: "patient_name", label: "Patient Name" },
  { key: "clinic_name", label: "Clinic Name" },
  { key: "appointment_date", label: "Appt Date" },
  { key: "appointment_time", label: "Appt Time" },
  { key: "service_interest", label: "Service / Treatment" },
  { key: "clinic_phone", label: "Clinic Phone" },
];

export function TemplatesView({ initialTemplates }: TemplatesViewProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreateDialog() {
    setEditingTemplate(null);
    setName("");
    setBody("Hello {{patient_name}}, thank you for contacting {{clinic_name}}. We'd love to help you with your dental care. When would be convenient for a consultation?");
    setPurpose("Initial response");
    setError(null);
    setDialogOpen(true);
  }

  function openEditDialog(tpl: MessageTemplate) {
    setEditingTemplate(tpl);
    setName(tpl.name);
    setBody(tpl.body);
    setPurpose(tpl.purpose || "");
    setError(null);
    setDialogOpen(true);
  }

  function insertVariable(varKey: string) {
    setBody((prev) => `${prev} {{${varKey}}}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res;
    if (editingTemplate) {
      res = await updateMessageTemplate(editingTemplate.id, {
        name,
        body,
        purpose,
      });
    } else {
      res = await createMessageTemplate({
        name,
        body,
        purpose,
        variables: [],
      });
    }

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setDialogOpen(false);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return;
    await deleteMessageTemplate(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreateDialog} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialTemplates.map((tpl) => (
          <Card key={tpl.id} className="border-border/60 hover:border-border transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold">{tpl.name}</CardTitle>
                  {tpl.purpose && (
                    <CardDescription className="text-xs mt-0.5">{tpl.purpose}</CardDescription>
                  )}
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Message Bubble Preview */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed relative">
                {tpl.body}
              </div>

              {/* Variables List */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  {tpl.variables?.length || 0} variables
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => openEditDialog(tpl)}
                    title="Edit"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(tpl.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <MessageSquare className="h-5 w-5" />
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "New WhatsApp Template"}
              </DialogTitle>
            </div>
            <DialogDescription>
              Create automated message drafts with personalized patient merge tags.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tplName">Template Name <span className="text-destructive">*</span></Label>
              <Input
                id="tplName"
                placeholder="e.g. Appointment Confirmation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tplPurpose">Purpose / Use Case</Label>
              <Input
                id="tplPurpose"
                placeholder="e.g. Sent when patient books consultation"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tplBody">Message Body <span className="text-destructive">*</span></Label>
                <span className="text-[11px] text-muted-foreground">{body.length} / 1024 chars</span>
              </div>
              <Textarea
                id="tplBody"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                required
                className="font-sans text-xs"
              />
            </div>

            {/* Merge Tag Chips */}
            <div>
              <Label className="text-xs text-muted-foreground block mb-2">
                Click to insert personalization variable:
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="px-2 py-1 rounded-md text-[11px] font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border/50"
                  >
                    + {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Template"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
