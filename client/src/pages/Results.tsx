import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResults } from "@/hooks/use-additional-content";
import { Search, GraduationCap } from "lucide-react";

export default function Results() {
  const [rollNo, setRollNo] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const { data: results, isLoading } = useResults(searchTrigger);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTrigger(rollNo);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <GraduationCap className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">Check Your Results</h1>
          <p className="text-muted-foreground text-lg">Enter your roll number below to view your performance.</p>
        </div>

        <Card className="max-w-xl mx-auto shadow-xl border-none">
          <CardContent className="pt-8">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input 
                placeholder="Enter Roll Number (e.g. 2024001)" 
                className="h-12 text-lg"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
              <Button type="submit" size="lg" className="h-12 px-8">
                <Search className="w-5 h-5 mr-2" /> Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 max-w-2xl mx-auto">
          {isLoading && searchTrigger && <div className="text-center py-12">Searching...</div>}
          
          {results && results.length > 0 ? (
            <div className="space-y-6">
              {results.map((result: any) => (
                <Card key={result.id} className="border-none shadow-md overflow-hidden">
                  <div className="bg-primary text-white p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold">{result.studentName}</h2>
                        <p className="opacity-80">Roll No: {result.rollNo}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm uppercase tracking-wider opacity-80">{result.examName}</div>
                        <div className="text-xl font-bold">{result.year}</div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-8">
                      {Object.entries(result.data).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <div className="text-sm text-muted-foreground uppercase font-semibold">{key}</div>
                          <div className="text-2xl font-bold text-primary">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchTrigger && !isLoading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <p className="text-xl text-muted-foreground">No results found for roll number "{searchTrigger}"</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
