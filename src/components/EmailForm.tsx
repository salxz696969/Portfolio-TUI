import React, { useState } from "react";
import TextInput from "ink-text-input";
import open from "open";

interface Props {
  onSubmitted?: () => void;
}

export default function EmailForm({ onSubmitted }: Props) {
  const [message, setMessage] = useState("");

  const handleSubmit = (val: string) => {
    const body = encodeURIComponent(val);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=saovisal12192005@gmail.com&su=Portfolio%20Inquiry&body=${body}`;
    open(url).catch(() => {});
    onSubmitted?.();
  };

  return (
    <TextInput
      value={message}
      onChange={setMessage}
      onSubmit={handleSubmit}
      placeholder="Your message here..."
    />
  );
}
