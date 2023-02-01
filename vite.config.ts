import { defineConfig } from 'vite'
import path from "path";
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/dids': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  plugins: [
    dts({
      include: ["src/mee-sdk.ts", "src/types.ts"],
      beforeWriteFile: (filePath: string, content: string) => {
        const rootFilePath = filePath.replace("/src", ""); // place d.ts in dist/ instead of dist/src/
        return {filePath: rootFilePath, content}
      },
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
        entry: path.resolve(__dirname, "src/mee-sdk.ts"),
        name: "mee-js-sdk",
        formats: ["umd","es", "cjs"],
    },
  },
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
  },
})
