"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
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
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password. Please check your credentials and try again." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email address before signing in. (Or disable 'Confirm email' in Supabase Auth Settings to allow instant access)." };
    }
    return { error: error.message || "Unable to sign in. Please try again." };
  }

  if (signInData?.user) {
    let dbClient = supabase;
    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here"
    ) {
      try {
        dbClient = createServiceClient();
      } catch {
        dbClient = supabase;
      }
    }

    // Check if user already has a clinic workspace
    const { data: membership, error: memberError } = await dbClient
      .from("clinic_memberships")
      .select("id, clinic_id")
      .eq("user_id", signInData.user.id)
      .limit(1)
      .maybeSingle();

    if (memberError) {
      console.warn("Membership check warning during login:", memberError.message);
    }

    if (membership) {
      redirect("/dashboard");
    }

    // Only redirect to onboarding if we know for sure they have no clinic
    if (!membership && !memberError) {
      redirect("/onboarding");
    }
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
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("already exists")) {
      return { error: "An account with this email already exists. Please sign in instead." };
    }
    return { error: error.message || "Unable to create account. Please try again." };
  }

  // If email verification is disabled in Supabase, session is returned immediately
  if (signUpData?.session) {
    // Ensure profile is initialized
    if (signUpData.user) {
      await supabase.from("profiles").upsert(
        {
          user_id: signUpData.user.id,
          display_name: parsed.data.name,
          timezone: "Asia/Kolkata",
        },
        { onConflict: "user_id" }
      );
    }
    redirect("/onboarding");
  }

  return {
    success:
      "Account registered! If email confirmation is enabled in your Supabase project, check your inbox. If email confirmation is disabled, you can sign in directly now.",
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
    return { error: "You must be logged in to create a clinic. Please sign in and try again." };
  }

  const name = formData.get("name") as string;
  if (!name || name.length < 2) {
    return { error: "Clinic name must be at least 2 characters." };
  }

  const slug = slugify(name) + "-" + Date.now().toString(36);

  // Use service client if SUPABASE_SERVICE_ROLE_KEY is set to bypass RLS, otherwise fallback to user's supabase client
  let dbClient = supabase;
  if (
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here"
  ) {
    try {
      dbClient = createServiceClient();
    } catch {
      dbClient = supabase;
    }
  }

  // Check if user already has an active clinic (prevent duplicate on refresh)
  const { data: existingMembership } = await dbClient
    .from("clinic_memberships")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (existingMembership) {
    redirect("/dashboard");
  }

  // 1. Ensure user profile exists
  const { error: profileError } = await dbClient.from("profiles").upsert(
    {
      user_id: user.id,
      display_name: (user.user_metadata?.display_name as string) || user.email?.split("@")[0] || "Clinic Owner",
      timezone: (formData.get("timezone") as string) || "Asia/Kolkata",
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    console.error("Profile upsert error:", profileError.message);
    if (profileError.message.includes("does not exist") || profileError.message.includes("relation")) {
      return {
        error: "Database tables not found. Please run the migration script (supabase/migrations/001_initial_schema.sql) in your Supabase SQL Editor.",
      };
    }
  }

  // 2. Generate clinic ID explicitly on server to avoid RLS select deadlock during insert
  const clinicId = crypto.randomUUID();

  // 3. Create clinic (WITHOUT chaining .select() so Postgres RLS SELECT policy is not evaluated before membership exists)
  const { error: clinicError } = await dbClient
    .from("clinics")
    .insert({
      id: clinicId,
      name,
      slug,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      city: (formData.get("city") as string) || null,
      state: (formData.get("state") as string) || null,
      pincode: (formData.get("pincode") as string) || null,
      timezone: (formData.get("timezone") as string) || "Asia/Kolkata",
      currency: (formData.get("currency") as string) || "INR",
      lead_sources: (formData.getAll("lead_sources") as string[]) || ["phone", "walk_in", "whatsapp"],
      onboarding_completed: true,
    });

  if (clinicError) {
    console.error("Clinic creation error:", clinicError.message);
    if (clinicError.message.includes("does not exist") || clinicError.message.includes("relation")) {
      return {
        error: "Database table 'clinics' not found. Please run the migration script (supabase/migrations/001_initial_schema.sql) in your Supabase SQL Editor.",
      };
    }
    return { error: `Database error: ${clinicError.message}` };
  }

  // 4. Create owner membership
  const { error: memberError } = await dbClient
    .from("clinic_memberships")
    .insert({
      clinic_id: clinicId,
      user_id: user.id,
      role: "owner",
      status: "active",
    });

  if (memberError) {
    console.error("Membership creation error:", memberError.message);
    return { error: `Clinic created but unable to set up owner membership: ${memberError.message}` };
  }

  // 5. Seed default message templates
  try {
    await dbClient.from("message_templates").insert([
      {
        clinic_id: clinicId,
        name: "Welcome Message",
        body: "Hello {{patient_name}}, thank you for your interest in {{clinic_name}}. We'd love to help you with your dental care needs. When would be a good time for a consultation?",
        variables: ["patient_name", "clinic_name"],
        purpose: "First contact with new enquiries",
        active: true,
      },
      {
        clinic_id: clinicId,
        name: "Appointment Reminder",
        body: "Hello {{patient_name}}, this is a reminder about your appointment at {{clinic_name}} on {{appointment_date}} at {{appointment_time}}. Please let us know if you need to reschedule.",
        variables: ["patient_name", "clinic_name", "appointment_date", "appointment_time"],
        purpose: "Appointment reminders",
        active: true,
      },
      {
        clinic_id: clinicId,
        name: "Follow-up",
        body: "Hello {{patient_name}}, we wanted to check in with you. If you have any questions about your dental care or would like to schedule a visit, please don't hesitate to reach out to {{clinic_name}}.",
        variables: ["patient_name", "clinic_name"],
        purpose: "General follow-up",
        active: true,
      },
    ]);
  } catch (err) {
    console.warn("Could not seed default message templates:", err);
  }

  redirect("/dashboard");
}
