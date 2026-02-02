import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type LoginInput = z.infer<typeof api.auth.login.input>;

export function useLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }

      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Welcome back", description: "Successfully logged in as Authority." });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Access Denied",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

