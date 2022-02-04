import { defineConfig } from 'vite'
import path from "path";
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      include: "src/mee-sdk.ts",
      beforeWriteFile: (filePath: string, content: string) => {
        const rootFilePath = filePath.replace("/src", ""); // place d.ts in dist/ instead of dist/src/
        return {filePath: rootFilePath, content}
      }
    })
  ],
  build: {
    lib: {
        entry: path.resolve(__dirname, "src/mee-sdk.ts"),
        name: "Mee Web SDK",
        formats: ["umd", "es"],
        fileName: (formats) => formats.includes("es") ? "mee-sdk-es.js": "mee-sdk.js",
    },
  },
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
  },
})
