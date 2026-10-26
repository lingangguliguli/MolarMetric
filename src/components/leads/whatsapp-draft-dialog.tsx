"use client";

import { useState, useEffect } from "react";
import { getMessageTemplates, generateWhatsAppDraft } from "@/app/actions/templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import type { MessageTemplate } from "@/lib/types";

interface WhatsAppDraftDialogProps {
  leadId: string;
  leadName: string;
  leadPhone: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppDraftDialog({
  leadId,
  leadName,
  leadPhone,
  open,
  onOpenChange,
}: WhatsAppDraftDialogProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [renderedMessage, setRenderedMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    if (open) {
      getMessageTemplates().then((tpls) => {
        setTemplates(tpls);
        if (tpls.length > 0) {
          setSelectedTemplateId(tpls[0].id);
        }
      });
    }
  }, [open]);

  useEffect(() => {
    if (selectedTemplateId && leadId) {
      setLoading(true);
      generateWhatsAppDraft(selectedTemplateId, leadId).then((res) => {
        setLoading(false);
        if (res.success && res.renderedBody && res.whatsappUrl) {
          setRenderedMessage(res.renderedBody);
          setWhatsappUrl(res.whatsappUrl);
        }
      });
    }
  }, [selectedTemplateId, leadId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <MessageSquare className="h-5 w-5" />
            <DialogTitle>Send WhatsApp to Patient</DialogTitle>
          </div>
          <DialogDescription>
            Patient: <span className="font-semibold text-foreground">{leadName}</span> ({leadPhone})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Select Message Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id}>
                    {tpl.name} {tpl.purpose ? `(${tpl.purpose})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preview">Message Preview</Label>
            {loading ? (
              <div className="h-28 flex items-center justify-center border rounded-lg bg-muted/40">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Textarea
                id="preview"
                value={renderedMessage}
                onChange={(e) => {
                  setRenderedMessage(e.target.value);
                  const waNumber = leadPhone.replace(/[\s\-\(\)\.]/g, "").replace("+", "");
                  setWhatsappUrl(`https://wa.me/${waNumber}?text=${encodeURIComponent(e.target.value)}`);
                }}
                rows={4}
                className="text-sm font-sans"
              />
            )}
            <p className="text-xs text-muted-foreground">
              You can edit the message text before opening WhatsApp. Variables like patient and clinic names have been inserted.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open WhatsApp Chat
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
