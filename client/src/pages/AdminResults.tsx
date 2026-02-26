import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useResults, useBulkCreateResults } from "@/hooks/use-additional-content";
import { Upload, Search, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminResults() {
  const [rollNo, setRollNo] = useState("");
  const { data: results, isLoading } = useResults();
  const bulkCreate = useBulkCreateResults();
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, we'd use a library like xlsx. For this demo, we'll simulate processing a CSV
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      const headers = lines[0].split(",");
      
      const parsedData = lines.slice(1).map(line => {
        const values = line.split(",");
        return {
          rollNo: values[0],
          studentName: values[1],
          examName: values[2],
          year: parseInt(values[3]),
          data: { marks: values[4], grade: values[5] },
          status: "published"
        };
      });

      bulkCreate.mutate(parsedData, {
        onSuccess: () => {
          toast({ title: "Success", description: `Uploaded ${parsedData.length} results.` });
        }
      });
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Exam Results</h2>
          <div className="flex gap-4">
            <Button variant="outline" className="relative cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept=".csv"
                onChange={handleFileUpload}
              />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by Roll No..." 
                className="pl-10"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Result Info</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : results?.map((result: any) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.rollNo}</TableCell>
                    <TableCell>{result.studentName}</TableCell>
                    <TableCell>{result.examName}</TableCell>
                    <TableCell>{result.year}</TableCell>
                    <TableCell>{JSON.stringify(result.data)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
