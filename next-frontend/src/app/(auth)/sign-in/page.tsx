import { SignInForm } from "@/app/(auth)/sign-in/_sign-in-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center">
      <SignInForm className="w-full min-w-sm" />
    </div>
  );
}
