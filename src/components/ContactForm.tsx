import React, { useState } from "react";
import emailjs from "@emailjs/browser";

type ContactState = { name: string; email: string; message: string };

export const ContactForm: React.FC = () => {
  const [state, setState] = useState<ContactState>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setErrorMsg(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS config missing. Check .env file.");
      setErrorMsg("Email service not configured.");
      setLoading(false);
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: state.name || "Anonymous",
          from_email: state.email,
          message: state.message,
          subject: `Portfolio Contact from ${state.name}`,
        },
        publicKey
      );

      // success
      setSuccess(true);
      setState({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Failed to send contact message", err);
      setSuccess(false);
      setErrorMsg("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3" aria-live="polite">
      <label htmlFor="name" className="text-sm text-[var(--text)]">Name</label>
      <input
        id="name"
        name="name"
        title="Name"
        placeholder="Your name"
        value={state.name}
        onChange={update}
        className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] backdrop-blur-md border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:outline-none focus:bg-[var(--input-focus)] focus:ring-2 focus:ring-[var(--brand)]/40 focus:border-[var(--brand)] transition-all shadow-sm focus:shadow-md"
        required
      />
      <label htmlFor="email" className="text-sm text-[var(--text)]">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        title="Email"
        placeholder="Your email"
        value={state.email}
        onChange={update}
        className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] backdrop-blur-md border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:outline-none focus:bg-[var(--input-focus)] focus:ring-2 focus:ring-[var(--brand)]/40 focus:border-[var(--brand)] transition-all shadow-sm focus:shadow-md"
        required
      />
      <label htmlFor="message" className="text-sm text-[var(--text)]">Message</label>
      <textarea
        id="message"
        name="message"
        title="Message"
        placeholder="Your message"
        value={state.message}
        onChange={update}
        rows={6}
        className="w-full px-4 py-3 rounded-xl bg-[var(--input-bg)] backdrop-blur-md border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)]/70 focus:outline-none focus:bg-[var(--input-focus)] focus:ring-2 focus:ring-[var(--brand)]/40 focus:border-[var(--brand)] transition-all shadow-sm focus:shadow-md resize-y"
        required
      />

      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:scale-105 transition-all duration-300 shadow-[0_4px_14px_0_color-mix(in_srgb,var(--brand)_39%,transparent)] hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--brand)_50%,transparent)] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send message"}
        </button>

        {success === true && (
          <div className="text-sm text-emerald-700 dark:text-emerald-400">
            Message sent — thank you!
          </div>
        )}
        {success === false && (
          <div className="text-sm text-red-700 dark:text-red-400">
            {errorMsg || "Failed to send."}
          </div>
        )}
      </div>
    </form>
  );
};
