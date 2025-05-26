import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

export function showToast({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}) {
  toast({
    title,
    description,
    variant,
  });
}

export { Toaster };
