import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type errorSchemas } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Types
type Complaint = z.infer<typeof api.complaints.list.responses[200]>[number];
type InsertComplaint = z.infer<typeof api.complaints.create.input>;
type UpdateStatusInput = z.infer<typeof api.complaints.updateStatus.input>;

export function useComplaints() {
  return useQuery({
    queryKey: [api.complaints.list.path],
    queryFn: async () => {
      const res = await fetch(api.complaints.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch complaints");
      return api.complaints.list.responses[200].parse(await res.json());
    },
  });
}

export function useComplaintSearch(ticketCode?: string) {
  return useQuery({
    queryKey: [api.complaints.search.path, ticketCode],
    queryFn: async () => {
      if (!ticketCode) return null;
      const url = `${api.complaints.search.path}?ticket=${ticketCode}`;
      const res = await fetch(url);
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to search complaint");
      
      return api.complaints.search.responses[200].parse(await res.json());
    },
    enabled: !!ticketCode,
    retry: false,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertComplaint) => {
      const res = await fetch(api.complaints.create.path, {
        method: api.complaints.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit complaint");
      }
      
      return api.complaints.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.complaints.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number } & UpdateStatusInput) => {
      const url = buildUrl(api.complaints.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.complaints.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.complaints.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.complaints.list.path] });
      toast({ title: "Status Updated", description: "The complaint status has been changed." });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

