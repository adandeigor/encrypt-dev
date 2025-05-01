export interface Config {
    source: string;
    encrypted: string;
    encryption: string;
    key_hint?: string;
    profiles?: Record<string, Omit<Config, 'profiles'>>;
  }
  
  export class EnvsyncError extends Error {
    constructor(message: string, public readonly code: string) {
      super(message);
      this.name = 'EnvsyncError';
    }
  }