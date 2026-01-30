import { useState } from "react";
import { useComplaints, useUpdateComplaintStatus } from "@/hooks/use-complaints";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LayoutDashboard, LogOut, Filter, Loader2, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: complaints, isLoading } = useComplaints();
  const updateStatusMutation = useUpdateComplaintStatus();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleLogout = () => {
    // In a real app, this would call a logout API to clear cookies
    // For now we just redirect
    setLocation("/login");
  };

  const filteredComplaints = complaints?.filter(c => 
    statusFilter === "ALL" ? true : c.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "RESOLVED": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const stats = {
    total: complaints?.length || 0,
    submitted: complaints?.filter(c => c.status === 'SUBMITTED').length || 0,
    inProgress: complaints?.filter(c => c.status === 'IN_PROGRESS').length || 0,
    resolved: complaints?.filter(c => c.status === 'RESOLVED').length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-slate-900">Authority Dashboard</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-600 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-slate-900">{stats.submitted}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Complaints</h2>
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[140px] font-semibold">Ticket ID</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="w-[150px] font-semibold">Area</TableHead>
                  <TableHead className="w-[120px] font-semibold">Date</TableHead>
                  <TableHead className="w-[180px] font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex justify-center items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading complaints...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredComplaints?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No complaints found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints?.map((complaint) => (
                    <TableRow key={complaint.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono font-medium text-slate-600">
                        {complaint.ticketCode}
                      </TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell className="max-w-md truncate" title={complaint.description}>
                        {complaint.description}
                      </TableCell>
                      <TableCell>{complaint.area}</TableCell>
                      <TableCell className="text-slate-500">
                        {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={complaint.status}
                          onValueChange={(val) => updateStatusMutation.mutate({ 
                            id: complaint.id, 
                            status: val as "SUBMITTED" | "IN_PROGRESS" | "RESOLVED" 
                          })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className={`h-8 border-0 ${getStatusColor(complaint.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUBMITTED">Submitted</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}

