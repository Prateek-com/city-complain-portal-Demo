import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertComplaintSchema } from "@shared/schema";
import { useCreateComplaint } from "@/hooks/use-complaints";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, Megaphone, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";

const categories = [
  "Roads & Potholes",
  "Sanitation & Garbage",
  "Street Lighting",
  "Water Supply",
  "Traffic & Transport",
  "Public Safety",
  "Other"
];

export default function Home() {
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const createMutation = useCreateComplaint();

  const form = useForm<z.infer<typeof insertComplaintSchema>>({
    resolver: zodResolver(insertComplaintSchema),
    defaultValues: {
      name: "",
      mobile: "",
      category: "",
      area: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertComplaintSchema>) => {
    createMutation.mutate(data, {
      onSuccess: (data) => {
        setSuccessTicket(data.ticketCode);
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              <Megaphone className="w-4 h-4 mr-2" />
              Citizen Reporting Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-slate-900">
              Make Your City <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
                Better, Together
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Report civic issues directly to the municipal authority. Track real-time status updates and contribute to a cleaner, safer community.
            </p>
            
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl shadow-sm border border-slate-100 w-32">
                <span className="text-2xl font-bold text-primary">24/7</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Available</span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl shadow-sm border border-slate-100 w-32">
                <span className="text-2xl font-bold text-emerald-600">Fast</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Resolution</span>
              </div>
            </div>
          </motion.div>

          {/* Complaint Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl shadow-blue-900/5 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-blue-600 w-full" />
              <CardHeader>
                <CardTitle>File a Complaint</CardTitle>
                <CardDescription>Fill in the details below to report an issue.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="bg-slate-50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="9876543210" className="bg-slate-50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-slate-50">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area / Locality</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. MG Road, Block A" className="bg-slate-50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description of Issue</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe the issue in detail..." 
                              className="bg-slate-50 min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-300"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : "Submit Complaint"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={!!successTicket} onOpenChange={() => setSuccessTicket(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">Complaint Registered!</DialogTitle>
            <DialogDescription>
              Your complaint has been successfully submitted. Please save your ticket number for future tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 my-4 text-center">
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Your Ticket ID</p>
            <p className="text-3xl font-mono font-bold text-primary tracking-widest">{successTicket}</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button 
              className="w-full sm:w-auto" 
              onClick={() => setSuccessTicket(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

