"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";

const DEFAULT_MOTIVATIONS = [
  "Every phone call is a patient seeking confidence and comfort. Greet them with empathy.",
  "Fast follow-up shows patients we value their health as much as they do.",
  "Consistent care begins at reception. Your warmth sets the tone for their entire visit.",
  "A smile is the prettiest thing you'll ever wear — let's help our patients wear theirs proudly.",
  "Listening carefully to patient concerns is the first step of effective dental treatment.",
  "Small daily follow-ups build trust that lasts for decades.",
  "Treat every patient like family, and our clinic's reputation will take care of itself.",
  "Proactive scheduling prevents dental emergencies. You are protecting their smiles.",
];

export async function getDailyMotivation() {
  const { user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Check if already displayed today
  const { data: record } = await supabase
    .from("daily_motivation_records")
    .select("*, daily_motivations(message, category)")
    .eq("user_id", user.id)
    .eq("local_date", today)
    .maybeSingle();

  if (record && !record.dismissed_at) {
    const msg = (record as any).daily_motivations?.message || DEFAULT_MOTIVATIONS[0];
    return { id: record.id, message: msg, category: (record as any).daily_motivations?.category || "Patient Care" };
  }

  if (record && record.dismissed_at) {
    return null; // Dismissed for today
  }

  // Pick deterministic motivation based on day of year
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const dayOfYear = Math.floor((new Date().getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const fallbackIndex = dayOfYear % DEFAULT_MOTIVATIONS.length;

  const { data: dbMessage } = await supabase
    .from("daily_motivations")
    .select("id, message, category")
    .limit(1)
    .range(fallbackIndex, fallbackIndex)
    .maybeSingle();

  const chosenMessage = dbMessage?.message || DEFAULT_MOTIVATIONS[fallbackIndex];
  const chosenCategory = dbMessage?.category || "Front Desk Excellence";
  const chosenId = dbMessage?.id || 1;

  // Insert record
  const { data: newRecord } = await supabase
    .from("daily_motivation_records")
    .insert({
      user_id: user.id,
      local_date: today,
      message_id: chosenId,
      displayed_at: new Date().toISOString(),
    })
    .select("id")
    .maybeSingle();

  return {
    id: newRecord?.id || "temp",
    message: chosenMessage,
    category: chosenCategory,
  };
}

export async function dismissDailyMotivation(recordId: string) {
  const { user } = await getAuthenticatedClinic();
  const supabase = createClient();

  if (recordId && recordId !== "temp") {
    await supabase
      .from("daily_motivation_records")
      .update({ dismissed_at: new Date().toISOString() })
      .eq("id", recordId)
      .eq("user_id", user.id);
  }

  return { success: true };
}
