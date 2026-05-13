import { SiLinkedin, SiGithub } from "react-icons/si";

export default function ContactForm() {
  return (
    <footer className="flex flex-col items-center gap-6 border-t border-white/10 pt-12">
      <div className="flex gap-6">
        <a
          href="https://linkedin.com/in/KevinAtapattu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="LinkedIn"
        >
          <SiLinkedin className="w-6 h-6" />
        </a>
        <a
          href="https://github.com/kevinAtapattu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <SiGithub className="w-6 h-6" />
        </a>
      </div>
      <p className="text-sm text-white/40">© 2025 Kevin Atapattu</p>
    </footer>
  );
}
