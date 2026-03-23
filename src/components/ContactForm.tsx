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
        className="w-full px-3 py-2 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
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
        className="w-full px-3 py-2 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
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
        className="w-full px-3 py-2 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
        required
      />

      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg text-white bg-[var(--brand)] disabled:opacity-60 transition-opacity hover:opacity-90"
        >
          {loading ? "Sending..." : "Send message"}
        </button>

        {success === true && (
          <div className="text-sm text-green-600">
            Message sent — thank you!
          </div>
        )}
        {success === false && (
          <div className="text-sm text-red-600">
            {errorMsg || "Failed to send."}
          </div>
        )}
      </div>
    </form>
  );
};
