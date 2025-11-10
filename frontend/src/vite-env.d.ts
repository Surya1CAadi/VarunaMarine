/// <reference types="vite/client" />

// Minimal augmentations so `import.meta.env` is typed in this project.
// Vite already includes typings via `vite/client`, but some TS setups need this file present.
//
// You can extend with specific env vars if you expose them via VITE_*. Example:
// interface ImportMetaEnv { readonly VITE_API_BASE: string | undefined; }

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  // add other VITE_... variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
