import { DrawingParameters, DrawingState, Point } from '@/types';

// Strategy pattern for stopping conditions
export interface StoppingCondition {
  shouldStop(state: DrawingState, params: DrawingParameters): boolean;
}

export class DistanceStoppingCondition implements StoppingCondition {
  shouldStop(state: DrawingState, params: DrawingParameters): boolean {
    const dx = state.currentPoint.x - params.startPoint.x;
    const dy = state.currentPoint.y - params.startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= params.minDistance;
  }
}

export class CountStoppingCondition implements StoppingCondition {
  shouldStop(state: DrawingState, params: DrawingParameters): boolean {
    return state.totalLines >= params.maxLines;
  }
}

export class ExactPointStoppingCondition implements StoppingCondition {
  shouldStop(state: DrawingState, params: DrawingParameters): boolean {
    const tolerance = 2; // pixels
    const dx = Math.abs(state.currentPoint.x - params.startPoint.x);
    const dy = Math.abs(state.currentPoint.y - params.startPoint.y);
    return dx <= tolerance && dy <= tolerance && state.totalLines > 1;
  }
}
