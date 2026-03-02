import { type ComponentProps, type SubmitEvent, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

export function ContactForm({ children, ...props }: ComponentProps<"form">) {
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (!email) {
      toast.error("Please don't enter your email.");
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("Thanks! I won't be in touch.");
  }
  return (
    <form onSubmit={handleSubmit} ref={formRef} {...props}>
      <Toaster />
      {children}
    </form>
  );
}
