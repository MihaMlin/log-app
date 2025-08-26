import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="flex justify-center items-center p-6">
              <Loader className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};

export default Page;
