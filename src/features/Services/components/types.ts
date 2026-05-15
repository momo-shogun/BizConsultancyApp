import { ComponentType } from 'react';

export interface StepComponentProps {
  stepIndex: number;
  totalSteps: number;
  config: StepConfig;
}

export interface StepConfig {
  key: string;
  title: string;
  description: string;
  component: ComponentType<StepComponentProps>;
  data?: Record<string, unknown>;
}

export interface StepperProps {
  steps: StepConfig[];
  initialStep?: number;
  onComplete?: () => void;
}

export interface StepRendererProps extends StepComponentProps {
  onNext: () => void;
  onBack: () => void;
}
