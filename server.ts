import express, { Request, Response } from 'express';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { Storyboard, Shot, ShotType, CameraMovement, CompositionGuide, SilhouetteType } from './src/types/storyboard';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization with telemetry header and placeholder check
const apiKey = process.env.GEMINI_API_KEY;
const isRealApiKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15;

const ai = isRealApiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Procedural fallback generator in case API key is missing or network is unavailable
function generateProceduralStoryboard(params: {
  prompt: string;
  genre?: string;
  visualStyle?: string;
  aspectRatio?: '16:9' | '2.39:1' | '4:3' | '9:16';
  shotCount?: number;
}): Storyboard {
  const prompt = params.prompt.trim();
  const count = Math.min(Math.max(params.shotCount || 5, 3), 10);
  const genre = params.genre || 'Cinematic Drama';
  const visualStyle = params.visualStyle || '35mm Film Grain / Anamorphic';
  const aspectRatio = params.aspectRatio || '16:9';

  const shotTypes: ShotType[] = [
    'Extreme Wide Shot',
    'Wide Shot',
    'Medium Shot',
    'Medium Close-Up',
    'Close-Up',
    'Dutch Angle',
    'Over-the-Shoulder',
    'Tracking Shot'
  ];

  const cameraMoves: CameraMovement[] = [
    'Static',
    'Pan Right',
    'Steadicam Push',
    'Tracking / Dolly',
    'Dolly Zoom',
    'Tilt Down',
    'Crane / Jib'
  ];

  const compositions: CompositionGuide[] = [
    'rule-of-thirds',
    'center-framed',
    'diagonal-lead',
    'symmetric',
    'golden-spiral'
  ];

  const silhouettes: SilhouetteType[] = [
    'lone-figure',
    'two-characters',
    'vehicle',
    'cityscape',
    'landscape',
    'macro-detail'
  ];

  const colorPalettes = [
    { primary: '#090d16', secondary: '#00f0ff', accent: '#ff0055', mood: 'Neon Cyberpunk' },
    { primary: '#1c1917', secondary: '#f59e0b', accent: '#ef4444', mood: 'Warm Golden Hour' },
    { primary: '#030712', secondary: '#38bdf8', accent: '#ffffff', mood: 'Clinical Sci-Fi' },
    { primary: '#18181b', secondary: '#a1a1aa', accent: '#f59e0b', mood: 'Monochrome Noir' },
    { primary: '#052e16', secondary: '#4ade80', accent: '#fde047', mood: 'Earthy Wilderness' }
  ];

  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

  // Create clean title from prompt
  const titleWords = prompt.split(' ').slice(0, 5).join(' ');
  const title = titleWords.length > 3
    ? titleWords.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toUpperCase()
    : 'UNTITLED SCENE BREAKDOWN';

  const shots: Shot[] = [];
  let totalSeconds = 0;

  for (let i = 0; i < count; i++) {
    const shotNum = i + 1;
    const duration = [3, 4, 5, 6][i % 4];
    totalSeconds += duration;

    let shotType: ShotType = shotTypes[i % shotTypes.length];
    let movement: CameraMovement = cameraMoves[i % cameraMoves.length];
    let comp: CompositionGuide = compositions[i % compositions.length];
    let sil: SilhouetteType = silhouettes[i % silhouettes.length];

    if (i === 0) {
      shotType = 'Extreme Wide Shot';
      movement = 'Tracking / Dolly';
      comp = 'rule-of-thirds';
      sil = 'cityscape';
    } else if (i === count - 1) {
      shotType = 'Wide Shot';
      movement = 'Static';
      comp = 'golden-spiral';
      sil = 'landscape';
    }

    shots.push({
      id: `shot-${Date.now()}-${shotNum}`,
      shotNumber: shotNum,
      duration,
      shotType,
      cameraMovement: movement,
      lensAndSpecs: `${i === 0 ? '24mm' : i === count - 1 ? '35mm' : '50mm'} Anamorphic T1.8 • Cinema Rig`,
      lightingMood: `${palette.mood} lighting with directional rim glow and atmospheric haze.`,
      sceneDescription: i === 0
        ? `Establishing shot: Introducing the environment for "${prompt}". High atmospheric tension.`
        : i === 1
        ? `Key subject moves into frame. The central conflict begins to emerge with subtle physical cues.`
        : i === 2
        ? `Rising tension: A critical discovery or turning point occurs, captured in intimate detail.`
        : i === 3
        ? `Climactic reaction: The stakes reach peak intensity as immediate action is demanded.`
        : `Resolution and lingering aftermath: The camera pulls away, leaving poignant narrative resonance.`,
      characterAction: `Protagonist responds with calculated urgency, scanning the surroundings while adjusting to the unfolding event.`,
      dialogue: i % 2 === 1 ? {
        speaker: 'PROTAGONIST',
        text: i === 1
          ? 'Look closely. This was never an accident.'
          : 'Hold your positions. We only get one shot at this.'
      } : undefined,
      soundDesign: `Environmental Foley, sub-bass rumble, atmospheric reverb matching ${genre} aesthetics.`,
      musicCue: `Subtle crescendo of brass and analog synthesizers building emotional resonance.`,
      directorNote: `Keep shot rhythm deliberate. Ensure composition emphasizes visual weight and leading lines.`,
      visualColorTheme: palette,
      compositionGuide: comp,
      silhouetteType: sil
    });
  }

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const runtimeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return {
    id: `sb-${Date.now()}`,
    title: title || 'CINEMATIC STORYBOARD',
    logline: `A captivating ${genre.toLowerCase()} sequence exploring: "${prompt}".`,
    genre,
    visualStyle,
    aspectRatio,
    prompt,
    estimatedRuntime: runtimeStr,
    createdAt: new Date().toISOString(),
    shots
  };
}

// Endpoint: Generate Full Storyboard
app.post('/api/generate-storyboard', async (req: Request, res: Response) => {
  try {
    const { prompt, genre, visualStyle, aspectRatio, shotCount } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const count = Math.min(Math.max(shotCount || 5, 3), 10);
    const chosenGenre = genre || 'Cinematic Drama';
    const chosenStyle = visualStyle || '35mm Film Grain / Anamorphic';
    const chosenAspect = (aspectRatio as '16:9' | '2.39:1' | '4:3' | '9:16') || '16:9';

    // If Gemini AI is available, use gemini-3.8-flash with structured schema
    if (ai) {
      try {
        const systemInstruction = `You are an elite Hollywood Director of Photography and Storyboard Artist.
Create an immaculate, compelling cinematic storyboard breakdown based on the user's concept.
Generate exactly ${count} shots that tell a complete, cohesive visual narrative arc (Setup, Inciting Incident, Rising Action, Climax, Resolution).
Ensure technical precision: specify lens focal lengths, lighting setups (chiaroscuro, golden hour, neon, rim light), camera movement, and audio cues.`;

        const userPrompt = `Concept Prompt: "${prompt}"
Genre: ${chosenGenre}
Visual Style: ${chosenStyle}
Aspect Ratio: ${chosenAspect}
Shot Count: ${count} shots.

Generate a comprehensive storyboard with title, logline, estimated runtime, and ${count} richly detailed shots.`;

        // Provide a 30-second timeout so Gemini has adequate time to synthesize the full storyboard
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 30s')), 30000)
        );

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Punchy cinematic title' },
                logline: { type: Type.STRING, description: '1-2 sentence compelling premise logline' },
                genre: { type: Type.STRING },
                visualStyle: { type: Type.STRING },
                estimatedRuntime: { type: Type.STRING, description: 'Runtime like 0:24 or 0:35' },
                shots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      shotNumber: { type: Type.INTEGER },
                      duration: { type: Type.INTEGER, description: 'Duration in seconds (e.g. 3 to 7)' },
                      shotType: {
                        type: Type.STRING,
                        description: 'Extreme Wide Shot, Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up, Over-the-Shoulder, Dutch Angle, Low Angle, High Angle, POV, or Tracking Shot'
                      },
                      cameraMovement: {
                        type: Type.STRING,
                        description: 'Static, Pan Left, Pan Right, Tilt Up, Tilt Down, Tracking / Dolly, Crane / Jib, Dolly Zoom, Handheld, or Steadicam Push'
                      },
                      lensAndSpecs: { type: Type.STRING, description: 'e.g. 35mm Anamorphic T1.5' },
                      lightingMood: { type: Type.STRING, description: 'Specific lighting description' },
                      sceneDescription: { type: Type.STRING, description: 'Visual action description for storyboard frame' },
                      characterAction: { type: Type.STRING, description: 'Actor movement, expression, or gesture' },
                      dialogueSpeaker: { type: Type.STRING, description: 'Speaker name if any, or empty' },
                      dialogueText: { type: Type.STRING, description: 'Dialogue line if any, or empty' },
                      soundDesign: { type: Type.STRING, description: 'Foley, SFX, ambient sound' },
                      musicCue: { type: Type.STRING, description: 'Musical score mood/cue' },
                      directorNote: { type: Type.STRING, description: 'Advice for the crew or animator' },
                      primaryColor: { type: Type.STRING, description: 'Hex color e.g. #0f172a' },
                      secondaryColor: { type: Type.STRING, description: 'Hex color e.g. #00f0ff' },
                      accentColor: { type: Type.STRING, description: 'Hex color e.g. #f43f5e' },
                      colorMood: { type: Type.STRING, description: 'Mood name e.g. Neon Noir' },
                      compositionGuide: {
                        type: Type.STRING,
                        description: 'rule-of-thirds, center-framed, diagonal-lead, symmetric, or golden-spiral'
                      },
                      silhouetteType: {
                        type: Type.STRING,
                        description: 'lone-figure, two-characters, crowd, vehicle, landscape, macro-detail, or cityscape'
                      }
                    },
                    required: [
                      'shotNumber',
                      'duration',
                      'shotType',
                      'cameraMovement',
                      'lensAndSpecs',
                      'lightingMood',
                      'sceneDescription',
                      'characterAction',
                      'soundDesign',
                      'musicCue',
                      'directorNote',
                      'primaryColor',
                      'secondaryColor',
                      'accentColor',
                      'colorMood',
                      'compositionGuide',
                      'silhouetteType'
                    ]
                  }
                }
              },
              required: ['title', 'logline', 'genre', 'visualStyle', 'estimatedRuntime', 'shots']
            }
          }
        });

        const response = await Promise.race([geminiCall, timeoutPromise]);

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.trim());

          const validShotTypes: ShotType[] = [
            'Extreme Wide Shot', 'Wide Shot', 'Medium Shot', 'Medium Close-Up',
            'Close-Up', 'Extreme Close-Up', 'Over-the-Shoulder', 'Dutch Angle',
            'Low Angle', 'High Angle', 'POV', 'Tracking Shot'
          ];
          const validMoves: CameraMovement[] = [
            'Static', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down',
            'Tracking / Dolly', 'Crane / Jib', 'Dolly Zoom', 'Handheld', 'Steadicam Push'
          ];
          const validComps: CompositionGuide[] = [
            'rule-of-thirds', 'center-framed', 'diagonal-lead', 'symmetric', 'golden-spiral'
          ];
          const validSils: SilhouetteType[] = [
            'lone-figure', 'two-characters', 'crowd', 'vehicle', 'landscape', 'macro-detail', 'cityscape'
          ];

          const shots: Shot[] = (parsed.shots || []).map((s: any, idx: number) => ({
            id: `shot-${Date.now()}-${idx + 1}`,
            shotNumber: idx + 1,
            duration: Number(s.duration) || 4,
            shotType: validShotTypes.includes(s.shotType) ? s.shotType : 'Wide Shot',
            cameraMovement: validMoves.includes(s.cameraMovement) ? s.cameraMovement : 'Static',
            lensAndSpecs: s.lensAndSpecs || '35mm Anamorphic T1.8',
            lightingMood: s.lightingMood || 'High contrast dramatic cinematic lighting',
            sceneDescription: s.sceneDescription || 'Cinematic composition depicting the scene.',
            characterAction: s.characterAction || 'Subject executes core movement.',
            dialogue: s.dialogueSpeaker && s.dialogueText ? {
              speaker: s.dialogueSpeaker,
              text: s.dialogueText
            } : undefined,
            soundDesign: s.soundDesign || 'Atmospheric soundscape and environmental foley',
            musicCue: s.musicCue || 'Cinematic underscore',
            directorNote: s.directorNote || 'Maintain visual consistency with lighting package.',
            visualColorTheme: {
              primary: s.primaryColor || '#090d16',
              secondary: s.secondaryColor || '#38bdf8',
              accent: s.accentColor || '#f59e0b',
              mood: s.colorMood || 'Cinematic'
            },
            compositionGuide: validComps.includes(s.compositionGuide) ? s.compositionGuide : 'rule-of-thirds',
            silhouetteType: validSils.includes(s.silhouetteType) ? s.silhouetteType : 'lone-figure'
          }));

          const storyboard: Storyboard = {
            id: `sb-${Date.now()}`,
            title: parsed.title || 'CINEMATIC STORYBOARD',
            logline: parsed.logline || `A sequence based on ${prompt}`,
            genre: parsed.genre || chosenGenre,
            visualStyle: parsed.visualStyle || chosenStyle,
            aspectRatio: chosenAspect,
            prompt,
            estimatedRuntime: parsed.estimatedRuntime || '0:25',
            createdAt: new Date().toISOString(),
            shots
          };

          res.json(storyboard);
          return;
        }
      } catch (geminiError: any) {
        console.info('Switching to procedural engine:', geminiError?.message || geminiError);
      }
    }

    // Fallback to high-quality procedural generation
    const fallbackStoryboard = generateProceduralStoryboard({
      prompt,
      genre: chosenGenre,
      visualStyle: chosenStyle,
      aspectRatio: chosenAspect,
      shotCount: count
    });

    res.json(fallbackStoryboard);
  } catch (error: any) {
    console.error('Error generating storyboard:', error);
    res.status(500).json({ error: error.message || 'Failed to generate storyboard' });
  }
});

// Endpoint: AI Polish / Director Actions
app.post('/api/ai-action', async (req: Request, res: Response) => {
  try {
    const { action, currentStoryboard, targetShotId, userNote } = req.body;

    if (!currentStoryboard) {
      res.status(400).json({ error: 'Storyboard context required' });
      return;
    }

    if (action === 'plot-twist') {
      const updatedLogline = `${currentStoryboard.logline} But a hidden revelation strikes: an ally's true identity turns the entire mission upside down.`;
      res.json({
        success: true,
        logline: updatedLogline,
        message: 'Plot twist infused into narrative arc.'
      });
      return;
    }

    if (action === 'add-beat') {
      const nextNum = (currentStoryboard.shots?.length || 0) + 1;
      const newShot: Shot = {
        id: `shot-${Date.now()}-${nextNum}`,
        shotNumber: nextNum,
        duration: 4,
        shotType: 'Close-Up',
        cameraMovement: 'Steadicam Push',
        lensAndSpecs: '65mm T1.5 Portrait Prime',
        lightingMood: 'Direct high-contrast rim light, deep background falloff',
        sceneDescription: userNote || 'Sudden turn of events: An unexpected sound echoes from the perimeter, arresting all motion.',
        characterAction: 'The protagonist halts mid-breath, turning sharply toward the source of the noise.',
        dialogue: {
          speaker: 'PROTAGONIST',
          text: 'Did you hear that? We\'re not alone.'
        },
        soundDesign: 'Sharp sudden metallic click followed by dead silence',
        musicCue: 'Heartbeat pulse with dissonant high string harmonic',
        directorNote: 'Snap zoom or rapid push-in to punch up the sudden dread.',
        visualColorTheme: currentStoryboard.shots?.[0]?.visualColorTheme || {
          primary: '#090d16',
          secondary: '#38bdf8',
          accent: '#f59e0b',
          mood: 'Tension'
        },
        compositionGuide: 'center-framed',
        silhouetteType: 'lone-figure'
      };
      res.json({ success: true, newShot });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Action failed' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineBoard server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
