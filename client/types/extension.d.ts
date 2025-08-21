// TypeScript declarations for LeetGuard extension integration

interface LeetGuardExtension {
  installed: boolean;
  version: string;
  name: string;
  isDeveloperMode: boolean;
  extensionId: string;
  detectedAt: number;
  features: string[];
}

declare global {
  interface Window {
    leetguardExtension?: LeetGuardExtension;
  }
}
