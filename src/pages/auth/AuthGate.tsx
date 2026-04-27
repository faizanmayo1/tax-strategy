import { useState, type ReactNode } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToast } from "@/app/providers/ToastProvider";
import { Mail, Lock, Building2, ShieldCheck, Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "mfa" | "forgot";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <AuthScreen />;
  return <>{children}</>;
}

function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="min-h-screen flex bg-ink-50">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          {mode === "signin" && <SignIn onSwitch={setMode} />}
          {mode === "signup" && <SignUp onSwitch={setMode} />}
          {mode === "mfa" && <MFA onSwitch={setMode} />}
          {mode === "forgot" && <ForgotPassword onSwitch={setMode} />}
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col w-[44%] max-w-[640px] bg-brand-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #3B5BFE 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full p-12">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-brand-500 to-accent-violet shadow-glow flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <div className="font-semibold text-[16px] tracking-tight">Aragon</div>
            <div className="text-[11px] text-white/55 uppercase tracking-wider">Tax Strategy & CFO Intelligence</div>
          </div>
        </div>

        <div className="mt-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 h-7 px-2.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-white/85 mb-4">
              <Sparkles className="h-3 w-3" /> AI-Powered Advisory Platform
            </div>
            <h2 className="text-[28px] leading-[1.15] font-semibold tracking-tight">
              Proactive tax strategy
              <br />
              <span className="bg-gradient-to-r from-brand-300 to-accent-violet bg-clip-text text-transparent">
                across every client.
              </span>
            </h2>
            <p className="mt-4 text-[14.5px] text-white/65 leading-relaxed max-w-md">
              Aragon analyzes bookkeeping, tax filings, entity structure, and cash flow across your full client book —
              surfacing missed savings before filing periods.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              "150+ clients triaged automatically each morning",
              "Tax savings opportunities surfaced with confidence scores",
              "CFO forecasts, anomalies & nexus alerts in one place",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[13.5px] text-white/80">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-brand-500/20 border border-brand-300/30 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-brand-300" />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
          <span>SOC 2 · GLBA aligned · Encrypted at rest</span>
          <span>v1.0 · Pilot</span>
        </div>
      </div>
    </div>
  );
}

interface ModeProps {
  onSwitch: (m: Mode) => void;
}

function SignIn({ onSwitch }: ModeProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("adnan@aragonadvisors.com");
  const [password, setPassword] = useState("••••••••");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSwitch("mfa");
    toast({ kind: "info", title: "Verification code sent", description: "Check your authenticator app." });
    sessionStorage.setItem("pending-email", email);
    void password;
  }

  return (
    <div className="bg-paper border border-ink-150 rounded-lg shadow-md p-8">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-h1 text-ink-900">Sign in</h1>
      </div>
      <p className="text-small text-ink-500 mb-6">Welcome back. Continue to your firm dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Work email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@firm.com"
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />
        </Field>
        <Field
          label="Password"
          rightLabel={
            <button
              type="button"
              onClick={() => onSwitch("forgot")}
              className="text-[12px] text-brand-700 hover:text-brand-500 font-medium"
            >
              Forgot password?
            </button>
          }
        >
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />
        </Field>

        <label className="flex items-center gap-2 text-[12.5px] text-ink-500 select-none">
          <input type="checkbox" className="h-3.5 w-3.5 accent-brand-500" defaultChecked />
          Trust this device for 30 days
        </label>

        <Button type="submit" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Continue
        </Button>
      </form>

      <SsoBlock />

      <div className="mt-6 text-center text-small text-ink-500">
        New to Aragon?{" "}
        <button onClick={() => onSwitch("signup")} className="text-brand-700 font-medium hover:text-brand-500">
          Create a firm account
        </button>
      </div>
    </div>
  );
}

function SignUp({ onSwitch }: ModeProps) {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [firmName, setFirmName] = useState("Aragon Advisors");
  const [partnerName, setPartnerName] = useState("Adnan Karim");
  const [email, setEmail] = useState("adnan@aragonadvisors.com");
  const [size, setSize] = useState<"solo" | "small" | "mid" | "large">("mid");

  function handleNext() {
    if (step < 3) setStep(step + 1);
    else {
      toast({ kind: "success", title: `Welcome, ${partnerName.split(" ")[0]}!`, description: "Sample firm seeded with 150 clients." });
      signIn(email);
    }
  }

  return (
    <div className="bg-paper border border-ink-150 rounded-lg shadow-md p-8">
      <Stepper current={step} steps={["Firm", "Account", "Integrations"]} />
      {step === 1 && (
        <>
          <h1 className="text-h1 text-ink-900 mt-6">Tell us about your firm</h1>
          <p className="text-small text-ink-500 mt-1 mb-5">We'll seed your workspace with realistic sample data.</p>
          <div className="space-y-4">
            <Field label="Firm name">
              <Input
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                leftIcon={<Building2 className="h-4 w-4" />}
              />
            </Field>
            <Field label="Firm size">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "solo", label: "Solo / 1–5 staff" },
                  { v: "small", label: "Small · 6–25" },
                  { v: "mid", label: "Mid · 26–100" },
                  { v: "large", label: "Large · 100+" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setSize(o.v as typeof size)}
                    className={cn(
                      "h-10 px-3 rounded-md border text-[13px] text-left transition-colors",
                      size === o.v
                        ? "border-brand-500 bg-brand-100/50 text-brand-700 font-medium"
                        : "border-ink-200 text-ink-700 hover:border-ink-300",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-h1 text-ink-900 mt-6">Create your account</h1>
          <p className="text-small text-ink-500 mt-1 mb-5">You'll be the first partner — invite your team next.</p>
          <div className="space-y-4">
            <Field label="Your name">
              <Input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} />
            </Field>
            <Field label="Work email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </Field>
            <Field label="Password">
              <Input type="password" defaultValue="••••••••••" leftIcon={<Lock className="h-4 w-4" />} />
            </Field>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h1 className="text-h1 text-ink-900 mt-6">Connect your data sources</h1>
          <p className="text-small text-ink-500 mt-1 mb-5">
            We'll skip this for the demo and use seeded data — you can connect later in Settings.
          </p>
          <div className="space-y-2">
            {[
              { name: "QuickBooks Online", note: "Bookkeeping" },
              { name: "Xero", note: "Bookkeeping" },
              { name: "Gusto", note: "Payroll" },
              { name: "ADP", note: "Payroll" },
              { name: "Plaid", note: "Bank feeds" },
            ].map((i) => (
              <div
                key={i.name}
                className="flex items-center justify-between border border-ink-150 rounded-md px-3 h-11 bg-ink-50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded bg-paper border border-ink-150 flex items-center justify-center text-[10px] font-bold text-ink-700">
                    {i.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-ink-900">{i.name}</div>
                    <div className="text-[11px] text-ink-400">{i.note}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : onSwitch("signin"))}
          className="text-small text-ink-500 hover:text-ink-700"
        >
          {step > 1 ? "Back" : "Already have an account?"}
        </button>
        <Button onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
          {step < 3 ? "Continue" : "Finish & enter Aragon"}
        </Button>
      </div>
    </div>
  );
}

function MFA({ onSwitch }: ModeProps) {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = sessionStorage.getItem("pending-email") ?? "adnan@aragonadvisors.com";
    toast({ kind: "success", title: "Verified", description: "Welcome back to Aragon." });
    signIn(email);
  }

  function setDigit(i: number, v: string) {
    const next = [...code];
    next[i] = v.slice(-1);
    setCode(next);
    if (v && i < 5) {
      const el = document.getElementById(`mfa-${i + 1}`);
      el?.focus();
    }
  }

  return (
    <div className="bg-paper border border-ink-150 rounded-lg shadow-md p-8">
      <div className="h-10 w-10 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h1 className="text-h1 text-ink-900">Two-factor authentication</h1>
      <p className="text-small text-ink-500 mt-1 mb-6">
        Enter the 6-digit code from your authenticator app to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-2 justify-between">
          {code.map((v, i) => (
            <input
              key={i}
              id={`mfa-${i}`}
              value={v}
              onChange={(e) => setDigit(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className="h-12 w-12 text-center text-h2 font-semibold rounded-md border border-ink-200 bg-paper text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none tabular"
            />
          ))}
        </div>
        <Button type="submit" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Verify and continue
        </Button>
      </form>
      <div className="mt-6 text-center text-small text-ink-500">
        Didn't get a code?{" "}
        <button className="text-brand-700 font-medium hover:text-brand-500">Resend</button> ·{" "}
        <button onClick={() => onSwitch("signin")} className="text-ink-500 hover:text-ink-700">
          Back to sign in
        </button>
      </div>
    </div>
  );
}

function ForgotPassword({ onSwitch }: ModeProps) {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    toast({ kind: "info", title: "Reset link sent", description: "Check your email inbox." });
  }

  return (
    <div className="bg-paper border border-ink-150 rounded-lg shadow-md p-8">
      <h1 className="text-h1 text-ink-900">Reset your password</h1>
      <p className="text-small text-ink-500 mt-1 mb-6">
        Enter your work email and we'll send you a secure reset link.
      </p>
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Work email">
            <Input type="email" defaultValue="adnan@aragonadvisors.com" leftIcon={<Mail className="h-4 w-4" />} />
          </Field>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      ) : (
        <div className="bg-success-bg border border-success/20 rounded-md p-4 text-success-ink text-small">
          A reset link is on its way. It will expire in 1 hour.
        </div>
      )}
      <div className="mt-6 text-center text-small text-ink-500">
        <button onClick={() => onSwitch("signin")} className="text-ink-500 hover:text-ink-700">
          ← Back to sign in
        </button>
      </div>
    </div>
  );
}

function Field({ label, rightLabel, children }: { label: string; rightLabel?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12.5px] font-medium text-ink-700">{label}</span>
        {rightLabel}
      </div>
      {children}
    </label>
  );
}

function SsoBlock() {
  return (
    <>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-ink-150" />
        <span className="text-[11px] uppercase tracking-wider text-ink-400">or</span>
        <div className="flex-1 h-px bg-ink-150" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="md">
          Continue with Google
        </Button>
        <Button variant="outline" size="md">
          Microsoft 365
        </Button>
      </div>
    </>
  );
}

function Stepper({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold",
                  done && "bg-brand-700 text-white",
                  active && "bg-brand-100 text-brand-700 ring-2 ring-brand-300/40",
                  !done && !active && "bg-ink-100 text-ink-400",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : idx}
              </div>
              <span className={cn("text-[12px]", active ? "text-ink-900 font-medium" : "text-ink-400")}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-ink-150" />}
          </div>
        );
      })}
    </div>
  );
}
