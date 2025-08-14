import { DrawingParameters, DrawingState, LineSegment, Point } from '@/types';
import { 
  LengthStrategy, 
  AngleStrategy, 
  ColorStrategy,
  FixedLengthStrategy,
  RandomLengthStrategy,
  FixedAngleStrategy,
  RandomAngleStrategy,
  FixedColorStrategy,
  RandomColorStrategy
} from './strategies';
import {
  StoppingCondition,
  DistanceStoppingCondition,
  CountStoppingCondition,
  ExactPointStoppingCondition
} from './stopping-conditions';

export class DrawingEngine {
  private lengthStrategy!: LengthStrategy;
  private angleStrategy!: AngleStrategy;
  private colorStrategy!: ColorStrategy;
  private stoppingCondition!: StoppingCondition;

  constructor(params: DrawingParameters) {
    this.updateStrategies(params);
  }

  updateStrategies(params: DrawingParameters): void {
    // Length strategy
    this.lengthStrategy = params.lengthMode === 'fixed' 
      ? new FixedLengthStrategy() 
      : new RandomLengthStrategy();

    // Angle strategy
    this.angleStrategy = params.angleMode === 'fixed'
      ? new FixedAngleStrategy()
      : new RandomAngleStrategy();

    // Color strategy
    this.colorStrategy = params.colorMode === 'fixed'
      ? new FixedColorStrategy()
      : new RandomColorStrategy();

    // Stopping condition
    switch (params.stoppingCondition) {
      case 'distance':
        this.stoppingCondition = new DistanceStoppingCondition();
        break;
      case 'count':
        this.stoppingCondition = new CountStoppingCondition();
        break;
      case 'exact':
        this.stoppingCondition = new ExactPointStoppingCondition();
        break;
    }
  }

  initializeDrawing(params: DrawingParameters): DrawingState {
    return {
      segments: [],
      currentPoint: { ...params.startPoint },
      currentAngle: 0,
      isComplete: false,
      totalLines: 0
    };
  }

  generateNextSegment(state: DrawingState, params: DrawingParameters): LineSegment | null {
    if (state.isComplete) return null;

    // Check stopping condition before generating new segment
    if (this.stoppingCondition.shouldStop(state, params)) {
      state.isComplete = true;
      return null;
    }

    // Calculate length and angle
    const length = this.lengthStrategy.calculateLength(params);
    const newAngle = this.angleStrategy.calculateAngle(params, state.currentAngle);
    
    // Convert angle to radians for calculation
    const angleRad = (newAngle * Math.PI) / 180;
    
    // Calculate end point
    const endPoint: Point = {
      x: state.currentPoint.x + Math.cos(angleRad) * length,
      y: state.currentPoint.y + Math.sin(angleRad) * length
    };

    // Generate color
    const color = this.colorStrategy.generateColor(params, state.totalLines);

    // Create segment
    const segment: LineSegment = {
      start: { ...state.currentPoint },
      end: endPoint,
      length,
      angle: newAngle,
      color
    };

    // Update state
    state.currentPoint = endPoint;
    state.currentAngle = newAngle;
    state.totalLines++;

    return segment;
  }

  generateComplete(params: DrawingParameters): DrawingState {
    const state = this.initializeDrawing(params);
    
    while (!state.isComplete) {
      const segment = this.generateNextSegment(state, params);
      if (segment) {
        state.segments.push(segment);
      }
      
      // Safety check to prevent infinite loops
      if (state.totalLines > 10000) {
        state.isComplete = true;
        break;
      }
    }

    return state;
  }
}
