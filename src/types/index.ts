export interface Config {
    profiles: {
      [key: string]: ProfileConfig;
    };
  }
  
  export interface ProfileConfig {
    source: string;
    encrypted: string;
    encryption: 'aes-256-cbc';
    key_hint: string;
  }
  
  export interface CommandOptions {
    profile?: string;
    all?: boolean;
  }