import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full border border-hairline/60 bg-ink/60 px-4 py-1 text-xs uppercase tracking-[0.3em] text-haze">
          404
        </span>
        <h1 className="font-display text-3xl text-foam sm:text-4xl">Page not found</h1>
        <p className="max-w-xl text-sm leading-relaxed text-haze">
          The page you were seeking drifted outside our constellation. Return to the hub to continue exploring the portfolio.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-lavend/50 bg-lavend/10 px-5 py-2 text-sm font-medium text-lavend transition-colors duration-150 hover:border-lavend hover:bg-lavend/20"
        data-cursor="hover"
      >
        Back to home
      </Link>
    </div>
  );
}
