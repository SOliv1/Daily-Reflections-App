import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import { getDailyOrbLine } from '../data/reflections';


export default function ContactBlock() {
  const formRef = useRef();
  const [sent, setSent] = useState(false);
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


  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      formRef.current,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setSent(true);
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
            <button type="submit">Send</button>
            </form>
    )}
    </section>


  );
}
