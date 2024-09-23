import React from "react";
import { load } from "./action";
import * as Babel from "@babel/standalone";
import { Button } from "@/components/ui/button";
async function ServerRender() {
  const loaded = await load();
  const components = await Promise.all(
    loaded.map(async (code) => {
      try {
        let transpiledCode = Babel.transform(code, {
          presets: ["react"],
          plugins: ["transform-modules-commonjs"],
        }).code;
        // append "use client" to all components
        transpiledCode = '"use client"\n' + transpiledCode;

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
        console.log(wrapper);
        wrapper(mockRequire, module, module.exports);

        // Get the default export (our component)
        const Component = (module.exports as any).default;

        // Render the component
        return <Component />;
      } catch (error) {
        console.error("Error rendering component:", error);
        return <div>Error rendering component: {(error as Error).message}</div>;
      }
    })
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {components}
    </div>
  );
}

export default ServerRender;
