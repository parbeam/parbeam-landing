import OnboardForm from "@/components/mvp/OnboardForm";
import { Logo } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function OnboardPage() {
  return (
    <div className="tipwrap">
      <a className="brand tipbrand" href="/">
        <Logo />
        Parbeam
      </a>
      <OnboardForm />
    </div>
  );
}
