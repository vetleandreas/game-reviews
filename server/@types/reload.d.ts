declare module 'reload' {
  import express from 'express';

  export default function reload(app: express.Express): Promise<{ reload: () => void }>;
}
