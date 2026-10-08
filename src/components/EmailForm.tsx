import React from "react";
import TextInput from "ink-text-input";
import { contactInfo } from "../data/content";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (gmailUrl: string) => void;
}

export default function EmailForm({ value, onChange, onSubmit }: Props) {
  const handleSubmit = (val: string) => {
    if (!val.trim()) return;
    const body = encodeURIComponent(val.trim());
    onSubmit(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=Portfolio%20Inquiry&body=${body}`
    );
  };

  return (
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={handleSubmit}
      placeholder="Your message here..."
    />
  );
}
