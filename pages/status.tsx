import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useComplaintSearch } from "@/hooks/use-complaints";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Activity, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Status() {
  const [searchTicket, setSearchTicket] = useState("");
  const [query, setQuery] = useState("");
  
  const { data: complaint, isLoading, isError, error } = useComplaintSearch(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTicket.trim()) {
      setQuery(searchTicket.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl font-display font-bold text-slate-900">Check Complaint Status</h1>
          <p className="text-muted-foreground text-lg">Enter your Ticket ID to view the current progress.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-12 max-w-lg mx-auto">
          <Input 
            placeholder="Enter Ticket ID (e.g. TKT-2024-X1Y2Z)" 
            className="h-12 text-lg bg-white shadow-sm border-slate-200"
            value={searchTicket}
            onChange={(e) => setSearchTicket(e.target.value)}
          />
          <Button type="submit" className="h-12 px-8 font-medium bg-primary hover:bg-primary/90 shadow-md">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-center py-12"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground">Searching records...</p>
              </div>
            </motion.div>
          ) : isError ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 rounded-xl p-8 text-center"
            >
              <div className="inline-flex p-3 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Ticket Not Found</h3>
              <p className="text-red-700/80">
                We couldn't find a complaint with ticket ID <span className="font-mono font-bold text-red-800">{query}</span>. 
                Please check the number and try again.
              </p>
            </motion.div>
          ) : complaint ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className={`h-2 w-full ${complaint.status === 'RESOLVED' ? 'bg-green-500' : 'bg-primary'}`} />
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ticket ID</p>
                      <CardTitle className="text-3xl font-mono text-primary tracking-wide">
                        {complaint.ticketCode}
                      </CardTitle>
                    </div>
                    <Badge className={`px-4 py-1.5 text-sm font-semibold rounded-full border shadow-none ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                          <p className="text-lg font-medium text-slate-900">{complaint.category}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                          <p className="text-lg font-medium text-slate-900">{complaint.area}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Date Reported</p>
                          <p className="text-lg font-medium text-slate-900">
                            {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                    <p className="text-slate-700 leading-relaxed">{complaint.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}

