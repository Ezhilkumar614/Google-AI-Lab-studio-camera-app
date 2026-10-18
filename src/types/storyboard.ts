export type ShotType =
  | 'Extreme Wide Shot'
  | 'Wide Shot'
  | 'Medium Shot'
  | 'Medium Close-Up'
  | 'Close-Up'
  | 'Extreme Close-Up'
  | 'Over-the-Shoulder'
  | 'Dutch Angle'
  | 'Low Angle'
  | 'High Angle'
  | 'POV'
  | 'Tracking Shot';

export type CameraMovement =
  | 'Static'
  | 'Pan Left'
  | 'Pan Right'
  | 'Tilt Up'
  | 'Tilt Down'
  | 'Tracking / Dolly'
  | 'Crane / Jib'
  | 'Dolly Zoom'
  | 'Handheld'
  | 'Steadicam Push';

export type CompositionGuide =
  | 'rule-of-thirds'
  | 'center-framed'
  | 'diagonal-lead'
  | 'symmetric'
  | 'golden-spiral';

export type SilhouetteType =
  | 'lone-figure'
  | 'two-characters'
  | 'crowd'
  | 'vehicle'
  | 'landscape'
  | 'macro-detail'
  | 'cityscape';

export interface Shot {
  id: string;
  shotNumber: number;
  duration: number; // in seconds
  shotType: ShotType;
  cameraMovement: CameraMovement;
  lensAndSpecs: string;
  lightingMood: string;
  sceneDescription: string;
  characterAction: string;
  dialogue?: {
    speaker: string;
    text: string;
  };
  soundDesign: string;
  musicCue: string;
  directorNote: string;
  visualColorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    mood: string;
  };
  compositionGuide: CompositionGuide;
  silhouetteType: SilhouetteType;
}

export type AspectRatio = '16:9' | '2.39:1' | '4:3' | '9:16';

export interface Storyboard {
  id: string;
  title: string;
  logline: string;
  genre: string;
  visualStyle: string;
  aspectRatio: AspectRatio;
  prompt: string;
  estimatedRuntime: string;
  createdAt: string;
  shots: Shot[];
}

export interface GenerateStoryboardRequest {
  prompt: string;
  genre?: string;
  visualStyle?: string;
  aspectRatio?: AspectRatio;
  shotCount?: number;
}
