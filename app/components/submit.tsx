"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { save } from "./action";
import * as Babel from "@babel/standalone";
import React from "react";

export function Submit() {
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Basic validation
      if (
        !code.includes("export default") &&
        !code.includes("export function")
      ) {
        throw new Error("Invalid component: missing default export");
      }
      // Try transpiling the code to catch syntax errors
      Babel.transform(code, {
        presets: ["react"],
        plugins: ["transform-modules-commonjs"],
      });
      await save(code);
      toast.success("Component submitted successfully!");
      setCode("");
    } catch (error) {
      toast.error(
        `Failed to submit component: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Code Snippet Manager</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your React component code here..."
          className="mb-4"
          rows={10}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
