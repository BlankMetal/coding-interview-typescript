"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Test cases are dynamic arrays of parameters
type TestCase = (number | string | null)[];

interface TestResult {
  testCase: number;
  inputs: TestCase;
  result: number;
  passed?: boolean;
}

interface RunResponse {
  results: TestResult[];
  summary?: {
    total: number;
    passed: number;
    failed: number;
    levelPassed?: number;
  };
  error?: string;
}

// Health check endpoint (hardcoded)
const HEALTH_CHECK_URL = "https://simple-connectivity-check.vercel.app/";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<RunResponse["summary"]>();
  const [error, setError] = useState<string>();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [availableLevels, setAvailableLevels] = useState<number>(6);
  
  // Health check state
  const [healthCheckStatus, setHealthCheckStatus] = useState<"loading" | "success" | "error">("loading");
  const [healthCheckError, setHealthCheckError] = useState<string>();

  // Fetch available levels on mount
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch("/api/levels");
        if (response.ok) {
          const data = await response.json();
          setAvailableLevels(data.levels || 6);
        }
      } catch (err) {
        console.error("Failed to fetch levels:", err);
      }
    };
    fetchLevels();
  }, []);

  // Perform health check on mount
  useEffect(() => {
    const performHealthCheck = async () => {
      try {
        const response = await fetch(HEALTH_CHECK_URL);
        const text = await response.text();
        
        if (response.ok && text.includes("Healthy")) {
          setHealthCheckStatus("success");
        } else {
          setHealthCheckStatus("error");
          setHealthCheckError("Unexpected response from server");
        }
      } catch (err) {
        setHealthCheckStatus("error");
        setHealthCheckError(
          "Error connecting to Vercel servers. Please debug any reason why .vercel.app domains can't be hit, and if you are sure it's not your machine reach out to your recruiter."
        );
      }
    };
    performHealthCheck();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    setError(undefined);
    setResults([]);
    setSummary(undefined);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge_level: selectedLevel,
          scenario_name: "ticket_pricing",
        }),
      });

      const data: RunResponse = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
        setSummary(data.summary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run tests");
    } finally {
      setLoading(false);
    }
  };

  const formatParamValue = (value: number | string | null) => {
    if (value === null) return "null";
    return value;
  };

  const getActiveParams = (inputs: TestCase) => {
    return inputs
      .map((value, index) => ({
        name: `p${index + 1}`,
        value,
      }))
      .filter(p => p.value !== null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Health Check Status Banner */}
        {healthCheckStatus === "loading" && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">
              Checking connectivity to Vercel servers...
            </p>
          </div>
        )}
        
        {healthCheckStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">
              ✓ Connectivity successful
            </p>
          </div>
        )}
        
        {healthCheckStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-semibold mb-2">
              ✗ Connection Error
            </p>
            <p className="text-red-700 text-sm">
              {healthCheckError || "Error connecting to Vercel servers. Please debug any reason why .vercel.app domains can't be hit, and if you are sure it's not your machine reach out to your recruiter."}
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">
            Blank Metal Coding Challenge
          </h1>
          <p className="text-zinc-600">
            Implement your solution in <code className="bg-zinc-200 px-2 py-1 rounded text-sm">lib/solution.ts</code>
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ready to Test</CardTitle>
              <CardDescription>
                Select your challenge level and test your solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Challenge Level
                  </label>
                  <Select
                    value={selectedLevel.toString()}
                    onValueChange={(value) => setSelectedLevel(parseInt(value, 10))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: availableLevels }, (_, i) => i + 1).map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Level {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleRun}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Running Tests..." : "Run Tests"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="mb-8 border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
              {error.includes("BACKEND_ENDPOINT") && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-900 font-semibold mb-2">
                    You are ready to interview!
                  </p>
                  <p className="text-sm text-blue-800">
                    During your interview, you&apos;ll receive a backend API URL.
                    Paste it into the <code className="bg-blue-200 px-1 rounded">BACKEND_ENDPOINT</code> variable in{" "}
                    <code className="bg-blue-200 px-1 rounded">lib/solution.ts</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {summary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8 text-lg">
                <div>
                  <span className="font-semibold">Total:</span> {summary.total}
                </div>
                <div className="text-green-600">
                  <span className="font-semibold">Passed:</span> {summary.passed}
                </div>
                <div className="text-red-600">
                  <span className="font-semibold">Failed:</span> {summary.failed}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {summary && typeof summary.levelPassed === 'number' && summary.levelPassed >= selectedLevel && (
          <Card className="mb-8 border-green-500 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">✓ Level Completed!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-900">
                You passed level {selectedLevel}! Please move on to the next level and ask your interviewer for the next part of the question.
              </p>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900">Test Results</h2>
            {results.map((result) => (
              <Card
                key={result.testCase}
                className={result.passed ? "border-green-500" : "border-red-500"}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Test Case #{result.testCase}
                    </CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${result.passed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {result.passed ? "✓ PASSED" : "✗ FAILED"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-zinc-700">Inputs:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {getActiveParams(result.inputs).map((param) => (
                          <span
                            key={param.name}
                            className="bg-zinc-100 px-3 py-1 rounded text-sm font-mono"
                          >
                            {param.name} = {formatParamValue(param.value)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-700">Your Result:</span>
                      <span className="ml-2 font-mono">{result.result}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!error && !loading && results.length === 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-blue-800">
                <p className="text-lg font-semibold">You are ready to interview! 🎉</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Before you start:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>During your interview, you&apos;ll receive a backend API URL</li>
                    <li>Open <code className="bg-blue-200 px-1 rounded">lib/solution.ts</code> and paste the URL into <code className="bg-blue-200 px-1 rounded">BACKEND_ENDPOINT</code></li>
                    <li>Implement your solution in the <code className="bg-blue-200 px-1 rounded">calc()</code> function</li>
                    <li>Click &quot;Run Tests&quot; to check your solution</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
