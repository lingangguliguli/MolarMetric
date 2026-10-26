"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema, forgotPasswordSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export interface AuthActionResult {
  error?: string;
  success?: string;
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password. Please try again." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email address before signing in." };
    }
    return { error: "Unable to sign in. Please try again." };
  }

  redirect("/dashboard");
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: "Unable to create account. Please try again." };
  }

  return {
    success:
      "Account created! Please check your email to verify your address.",
  };
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email") as string,
  };

  const parsed = forgotPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    // Don't reveal whether the email exists
    console.error("Password reset error:", error.message);
  }

  // Always return success to prevent email enumeration
  return {
    success: "If an account exists with that email, you will receive a password reset link.",
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Unable to update password. Please try again." };
  }

  redirect("/dashboard");
}

export async function createClinicAction(formData: FormData): Promise<AuthActionResult> {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "You must be logged in to create a clinic." };
  }

  const name = formData.get("name") as string;
  if (!name || name.length < 2) {
    return { error: "Clinic name must be at least 2 characters." };
  }

  const slug = slugify(name) + "-" + Date.now().toString(36);

  // Check if user already has a clinic (prevent duplicate on refresh)
  const { data: existingMembership } = await supabase
    .from("clinic_memberships")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .maybeSingle();

  if (existingMembership) {
    redirect("/dashboard");
  }

  // Create clinic
  const { data: clinic, error: clinicError } = await supabase
    .from("clinics")
    .insert({
      name,
      slug,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      address: formData.get("address") as string || null,
      city: formData.get("city") as string || null,
      state: formData.get("state") as string || null,
      pincode: formData.get("pincode") as string || null,
      timezone: (formData.get("timezone") as string) || "Asia/Kolkata",
      currency: (formData.get("currency") as string) || "INR",
      lead_sources: formData.getAll("lead_sources") as string[] || ["phone", "walk_in", "whatsapp"],
      onboarding_completed: true,
    })
    .select("id")
    .single();

  if (clinicError || !clinic) {
    console.error("Clinic creation error:", clinicError?.message);
    return { error: "Unable to create clinic. Please try again." };
  }

  // Create owner membership
  const { error: memberError } = await supabase
    .from("clinic_memberships")
    .insert({
      clinic_id: clinic.id,
      user_id: user.id,
      role: "owner",
      status: "active",
    });

  if (memberError) {
    console.error("Membership creation error:", memberError.message);
    return { error: "Clinic created but unable to set up membership. Please contact support." };
  }

  // Create default message templates
  await supabase.from("message_templates").insert([
    {
      clinic_id: clinic.id,
      name: "Welcome Message",
      body: "Hello {{patient_name}}, thank you for your interest in {{clinic_name}}. We'd love to help you with your dental care needs. When would be a good time for a consultation?",
      variables: ["patient_name", "clinic_name"],
      purpose: "First contact with new enquiries",
      active: true,
    },
    {
      clinic_id: clinic.id,
      name: "Appointment Reminder",
      body: "Hello {{patient_name}}, this is a reminder about your appointment at {{clinic_name}} on {{appointment_date}} at {{appointment_time}}. Please let us know if you need to reschedule.",
      variables: ["patient_name", "clinic_name", "appointment_date", "appointment_time"],
      purpose: "Appointment reminders",
      active: true,
    },
    {
      clinic_id: clinic.id,
      name: "Follow-up",
      body: "Hello {{patient_name}}, we wanted to check in with you. If you have any questions about your dental care or would like to schedule a visit, please don't hesitate to reach out to {{clinic_name}}.",
      variables: ["patient_name", "clinic_name"],
      purpose: "General follow-up",
      active: true,
    },
  ]);

  redirect("/dashboard");
}
