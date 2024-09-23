"use client";
import { Button } from "@/components/ui/button";
import * as Babel from "@babel/standalone";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { load } from "./action";
export const dyanmic = "force-dynamic";
const DynamicComponent = dynamic(
  () =>
    Promise.resolve((props: { code: string }) => {
      try {
        // Transpile the code
        const transpiledCode = Babel.transform(props.code, {
          presets: ["react"],
          plugins: ["transform-modules-commonjs"],
        }).code;

        // Mock require function
        const mockRequire = (moduleName: string) => {
          switch (moduleName) {
            case "react":
              return React;
            case "@/components/ui/button":
              return { Button };
            // Add cases for other UI components as needed
            // case "@/components/ui/alert":
            //   return { Alert };
            // case "@/components/ui/card":
            //   return { Card };
            default:
              throw new Error(`Unable to resolve module ${moduleName}`);
          }
        };

        // Create a new module and evaluate the transpiled code
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = { exports: {} };
        const wrapper = Function(
          "require",
          "module",
          "exports",
          transpiledCode as string
        );
        wrapper(mockRequire, module, module.exports);

        // Get the default export (our component)
        const Component = (module.exports as any).default;

        // Render the component
        return <Component />;
      } catch (error) {
        console.error("Error rendering component:", error);
        return <div>Error rendering component: {(error as Error).message}</div>;
      }
    }),
  { ssr: false }
);

export function ClientRender() {
  const [components, setComponents] = useState<string[]>([]);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    const data = await load();
    setComponents(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {components.map((component, index) => (
        <div key={index} className="border p-4 rounded">
          <DynamicComponent code={component} />
        </div>
      ))}
    </div>
  );
}
