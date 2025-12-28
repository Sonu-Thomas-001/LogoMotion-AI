export interface LogoData {
  svg: string;
  palette: string[];
  explanation: string;
  companyName: string;
}

export type AnimationType = 'none' | 'draw' | 'fade' | 'pop' | 'spin' | 'float' | 'slide';

export interface LogoRequest {
  companyName: string;
  industry: string;
  description: string;
  stylePreference: string;
  colors: string;
}

export interface AnimationPreset {
  id: AnimationType;
  label: string;
  description: string;
}