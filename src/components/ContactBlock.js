import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import { getDailyOrbLine } from '../data/reflections';


export default function ContactBlock() {
  const formRef = useRef();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  let currentSeason;
  if (month >= 2 && month <= 4) {
    currentSeason = 'spring';
  } else if (month >= 5 && month <= 7) {
    currentSeason = 'summer';
  } else if (month >= 8 && month <= 10) {
    currentSeason = 'autumn';
  } else {
    currentSeason = 'winter';
  }
  const seasonClass = `season-${currentSeason}`;

  const dailyOrbLine = getDailyOrbLine();
  const emailServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const emailTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const emailPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;


  const sendEmail = (e) => {
    e.preventDefault();
    setError("");

    if (!emailServiceId || !emailTemplateId || !emailPublicKey) {
      setError("The contact form is not configured yet. Please try again later.");
      return;
    }

    setSending(true);

    emailjs.sendForm(
      emailServiceId,
      emailTemplateId,
      formRef.current,
      emailPublicKey
    ).then(() => {
      setSent(true);
    }).catch((sendError) => {
      console.error('EmailJS send failed:', sendError);
      setError("Your message could not be sent right now. Please try again in a moment.");
    }).finally(() => {
      setSending(false);
    });
  };

  return (
    <section className={`contact-block ${seasonClass}`}>

        <div className={`contact-orb ${seasonClass}`}></div>
        <p className={`contact-intro ${seasonClass}`}>Want to share a thought?</p>
        <p className={`contact-micro ${seasonClass}`}>
            {dailyOrbLine || "You are already enough."}
        </p>

        <h2 className={`contact-title ${seasonClass}`}>Share a Reflection</h2>


        {sent ? (
            <p className="success">Thank you, your message has been sent.</p>
        ) : (
            <form ref={formRef} onSubmit={sendEmail}>
            <input name="name" placeholder="Your name" required />
            <input name="from_email" placeholder="Your email" required />
            <textarea name="message" placeholder="Your message" required />
            {error && <p className="contact-error" role="alert">{error}</p>}
            <button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </button>
            </form>
    )}
    </section>


  );
}
