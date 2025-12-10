import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ContactForm() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Let's Collaborate</h2>
      <Card>
        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            Name
            <input className="rounded-full bg-black/30 px-4 py-3" placeholder="Your name" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Email
            <input className="rounded-full bg-black/30 px-4 py-3" type="email" placeholder="you@domain.com" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Project Vision
            <textarea className="rounded-3xl bg-black/30 px-4 py-3" rows={4} placeholder="Describe the impact you're after" />
          </label>
          <Button type="submit" className="self-start">
            Send Message
          </Button>
        </form>
      </Card>
    </section>
  );
}
