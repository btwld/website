import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getResend } from "../../../lib/resend";

const CONTACT_RECIPIENTS = [
  "guilherme.rosa.c@conceptatech.com",
  "thomas@conceptatech.com",
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(200),
  email: z.email("Please enter a valid email address"),
  subject: z.string().trim().min(1, "Please enter a subject").max(200),
  message: z.string().trim().min(1, "Please enter a message").max(5000),
  // Honeypot: hidden from people, filled in by naive bots.
  website: z.string().optional(),
});

type ContactInput = z.infer<typeof contactSchema>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function contactHtml({ name, email, subject, message }: ContactInput) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #05040A;">New message from concepta.dev/contact</h2>

    <p><strong>Name:</strong> ${escapeHtml(name)}<br>
    <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><br>
    <strong>Subject:</strong> ${escapeHtml(subject)}</p>

    <p style="white-space: pre-wrap; padding: 16px; background: #f6f6f8; border-radius: 8px;">${escapeHtml(message)}</p>

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
      Reply to this email to answer ${escapeHtml(name)} directly.
    </p>
  </body>
</html>
`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = contactSchema.parse(body);

    if (input.website) {
      // Pretend success so bots don't retry.
      return NextResponse.json(
        { success: true, message: "Thanks — we'll be in touch soon." },
        { status: 200 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[contact] RESEND_API_KEY missing — dev no-op for:",
          input.email
        );
        return NextResponse.json(
          { success: true, message: "Dev mode: message logged, not sent." },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Contact form temporarily unavailable." },
        { status: 503 }
      );
    }

    const resend = getResend();

    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ?? "Concepta <hello@conceptatech.com>",
      to: CONTACT_RECIPIENTS,
      replyTo: input.email,
      subject: `[concepta.dev] ${input.subject}`,
      html: contactHtml(input),
    });

    if (error) {
      console.error("[contact] email failed:", error);
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    // Saving the sender as a contact is optional; it shouldn't fail the request.
    const audienceId = process.env.RESEND_AUDIENCE_ID_CONTACT;
    if (audienceId) {
      try {
        const [firstName, ...rest] = input.name.split(/\s+/);
        await resend.contacts.create({
          email: input.email,
          firstName,
          lastName: rest.join(" ") || undefined,
          audienceId,
        });
      } catch (contactError) {
        console.error("[contact] saving contact failed:", contactError);
      }
    }

    return NextResponse.json(
      { success: true, message: "Thanks — we'll be in touch soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[contact] error:", error);

    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        { success: false, message: firstIssue?.message || "Invalid input" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
