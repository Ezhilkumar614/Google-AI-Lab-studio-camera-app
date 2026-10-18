import { Storyboard } from '../types/storyboard';

export const SAMPLE_STORYBOARDS: Storyboard[] = [
  {
    id: 'cyberpunk-neon-heist',
    title: 'Neon Protocol: The Data Courier',
    logline: 'In rain-drenched Neo-Shinjuku, a rogue data courier realizes the cybernetic drive she is delivering is set to detonate the subterranean grid.',
    genre: 'Cyberpunk Thriller',
    visualStyle: 'Neo-Noir / High Contrast Teal & Orange',
    aspectRatio: '2.39:1',
    prompt: 'A rogue data courier racing across rainy neon rooftops in futuristic Neo-Tokyo, pursued by corporate stealth drones while carrying a pulsating quantum drive.',
    estimatedRuntime: '0:26',
    createdAt: new Date().toISOString(),
    shots: [
      {
        id: 'shot-1',
        shotNumber: 1,
        duration: 5,
        shotType: 'Extreme Wide Shot',
        cameraMovement: 'Crane / Jib',
        lensAndSpecs: '28mm Anamorphic T2.0 • Rain Streaks on Lens',
        lightingMood: 'High contrast cyan neon casting sharp reflections over flooded metallic catwalks',
        sceneDescription: 'Neo-Shinjuku skyscape at midnight. Torrential rain pours through holographic billboard advertisements. In the distant center, a lone hooded figure perches on an antenna tower.',
        characterAction: 'KIRA adjusts her damp optic visor, the reflection of skyscraper lights illuminating her eyes.',
        dialogue: {
          speaker: 'KIRA',
          text: 'Grid telemetry is down. We have less than ninety seconds before orbital lock.'
        },
        soundDesign: 'Distant siren wails, heavy raindrops splashing against iron grating, mechanical drone hum',
        musicCue: 'Low sub-bass drone rising into pulsating analog synthesizer arpeggios',
        directorNote: 'Emphasize architectural scale vs solitary courier. Camera slowly tilts down through smog layer.',
        visualColorTheme: {
          primary: '#090d16',
          secondary: '#00f0ff',
          accent: '#ff0055',
          mood: 'Rainy Cyberpunk'
        },
        compositionGuide: 'rule-of-thirds',
        silhouetteType: 'cityscape'
      },
      {
        id: 'shot-2',
        shotNumber: 2,
        duration: 4,
        shotType: 'Medium Close-Up',
        cameraMovement: 'Tracking / Dolly',
        lensAndSpecs: '50mm Anamorphic T1.4 • Shallow depth of field',
        lightingMood: 'Warm amber rim light from neon sign behind, cold blue key light on face',
        sceneDescription: 'Kira unlatches her weather-sealed cargo glove. Inside her palm, the titanium cipher casing pulses with a rhythmic violet glow.',
        characterAction: 'Her fingers twitch as the encrypted digital counter on the drive jumps from green to countdown red.',
        dialogue: {
          speaker: 'AI INTERFACE',
          text: 'Warning: Core destabilization sequence initiated by sender.'
        },
        soundDesign: 'Sharp electronic beep of decrypted code, metallic latch click, breath in respirator mask',
        musicCue: 'Tempo accelerates; distorted glitch percussion enters.',
        directorNote: 'Rack focus from Kira\'s tensed jaw to the ominous glowing digits on the drive.',
        visualColorTheme: {
          primary: '#120b24',
          secondary: '#ff0055',
          accent: '#00f0ff',
          mood: 'Tense Danger'
        },
        compositionGuide: 'center-framed',
        silhouetteType: 'lone-figure'
      },
      {
        id: 'shot-3',
        shotNumber: 3,
        duration: 3,
        shotType: 'Low Angle',
        cameraMovement: 'Steadicam Push',
        lensAndSpecs: '24mm Prime • Wide perspective distortion',
        lightingMood: 'Harsh twin searchlights sweeping from above, blinding lens flares',
        sceneDescription: 'Two sleek obsidian surveillance drones swoop down from the stormy cloud cover, rotating their tri-sensor gimbals directly toward the camera.',
        characterAction: 'The lead drone deploys twin electromagnetic taser prongs, electrical sparks crackling.',
        dialogue: {
          speaker: 'SYNTH DRONE',
          text: 'Asset 404 identified. Surrender cargo or lethal neutralization authorized.'
        },
        soundDesign: 'High-pitched turbine whine, crackling arc electricity, pneumatic servo whine',
        musicCue: 'Sudden aggressive industrial bass hit, percussion drops out for suspense',
        directorNote: 'Dynamic Dutch angle tilt to evoke imminent ambush and claustrophobia high above the streets.',
        visualColorTheme: {
          primary: '#0b1320',
          secondary: '#38bdf8',
          accent: '#facc15',
          mood: 'Menacing Ambush'
        },
        compositionGuide: 'diagonal-lead',
        silhouetteType: 'vehicle'
      },
      {
        id: 'shot-4',
        shotNumber: 4,
        duration: 6,
        shotType: 'Wide Shot',
        cameraMovement: 'Pan Right',
        lensAndSpecs: '35mm High-Speed T1.3 • Motion Blur on rain',
        lightingMood: 'Backlit by an exploding holographic billboard behind Kira',
        sceneDescription: 'Kira sprints across the slick glass roof, leaps over a yawning 80-story chasm, and fires her pneumatic grapnel toward an adjacent maglev rail.',
        characterAction: 'Mid-air leap captured in stylized slow motion as drone taser bolts shatter the glass behind her boots.',
        soundDesign: 'Glass shattering in slow motion, thunderclap rumble, cable whizzing through launcher',
        musicCue: 'Orchestral brass crescendo blending into driving drum-and-bass rhythm',
        directorNote: 'Hero action beat. Hold on the apex of the jump before cutting hard to impact.',
        visualColorTheme: {
          primary: '#0f172a',
          secondary: '#f43f5e',
          accent: '#38bdf8',
          mood: 'Kinetic Climax'
        },
        compositionGuide: 'diagonal-lead',
        silhouetteType: 'lone-figure'
      },
      {
        id: 'shot-5',
        shotNumber: 5,
        duration: 4,
        shotType: 'Extreme Close-Up',
        cameraMovement: 'Dolly Zoom',
        lensAndSpecs: '85mm Macro T2.8 • Micro detail',
        lightingMood: 'Monochromatic red emergency glow flashing at 1Hz',
        sceneDescription: 'The grapnel hook clamps hard onto the maglev track flange. In the drive\'s tiny LED display, the timer freezes at 00:03.',
        characterAction: 'Kira\'s eyes narrow as she reaches into her vest and severs the sender\'s uplink cable with a pocket arc-torch.',
        dialogue: {
          speaker: 'KIRA',
          text: 'Tell the syndicate their courier just canceled delivery.'
        },
        soundDesign: 'Heavy metallic clank of magnet clamp, hiss of severed fiber optics, rain sizzling on hot steel',
        musicCue: 'Final resonating electronic chord fading into distant rainfall',
        directorNote: 'Vertigo effect (dolly zoom) to register the sudden shift of power and survival.',
        visualColorTheme: {
          primary: '#1c1917',
          secondary: '#ef4444',
          accent: '#fbbf24',
          mood: 'Defiant Victory'
        },
        compositionGuide: 'center-framed',
        silhouetteType: 'macro-detail'
      },
      {
        id: 'shot-6',
        shotNumber: 6,
        duration: 4,
        shotType: 'Wide Shot',
        cameraMovement: 'Static',
        lensAndSpecs: '35mm Anamorphic • Deep focus',
        lightingMood: 'Dawn twilight breaking through smog, cold golden rays cutting through skyscraper valleys',
        sceneDescription: 'Kira stands atop the speeding maglev train as it races outward toward the coastal sector, the towering city skyline shrinking into misty morning silhouettes.',
        characterAction: 'She pockets the silenced drive and disappears into the train door shadows.',
        soundDesign: 'Smooth hum of magnetic levitation train gliding at 300km/h, wind rush',
        musicCue: 'Lyrical melancholic synth solo resolving to major key resolution',
        directorNote: 'Fade to black. Title card ready.',
        visualColorTheme: {
          primary: '#0f172a',
          secondary: '#fb923c',
          accent: '#38bdf8',
          mood: 'Atmospheric Horizon'
        },
        compositionGuide: 'golden-spiral',
        silhouetteType: 'landscape'
      }
    ]
  },
  {
    id: 'deep-space-odyssey',
    title: 'Signals Beyond Kepler-186f',
    logline: 'An astrobiologist aboard an orbital survey station intercepts a harmonic transmission originating from deep beneath an icy moon\'s methane ocean.',
    genre: 'Hard Sci-Fi Mystery',
    visualStyle: 'Atmospheric Kubrickian 70mm',
    aspectRatio: '16:9',
    prompt: 'A solitary astronaut inside an observation cupola discovering an ancient alien geometry surfacing through the ice of Europa.',
    estimatedRuntime: '0:22',
    createdAt: new Date().toISOString(),
    shots: [
      {
        id: 'shot-space-1',
        shotNumber: 1,
        duration: 5,
        shotType: 'Wide Shot',
        cameraMovement: 'Tracking / Dolly',
        lensAndSpecs: '21mm Prime T1.8 • Ultra clean glass',
        lightingMood: 'Harsh pure white sunlight bouncing off icy moon crater, deep pitch black void behind',
        sceneDescription: 'Circular observation deck of the Deep Horizon outpost. Massive monolithic curved windows frame the cracked surface of Europa rotating beneath.',
        characterAction: 'DR. ARIS CHEN sips lukewarm coffee, watching spectral analysis waveforms drift across hovering glass consoles.',
        dialogue: {
          speaker: 'DR. CHEN',
          text: 'Log entry 412. Background cosmic noise has dropped to absolute zero. That should be impossible.'
        },
        soundDesign: 'Gentle air scrubber hum, faint heartbeat monitor, acoustic reverb of quiet steel chamber',
        musicCue: 'Minimalist glass-harmonica chords with eerie sustained cello notes',
        directorNote: 'Emphasize human vulnerability inside a clinical titanium sphere surrounded by endless vacuum.',
        visualColorTheme: {
          primary: '#030712',
          secondary: '#38bdf8',
          accent: '#ffffff',
          mood: 'Cosmic Solitude'
        },
        compositionGuide: 'symmetric',
        silhouetteType: 'two-characters'
      },
      {
        id: 'shot-space-2',
        shotNumber: 2,
        duration: 4,
        shotType: 'Medium Close-Up',
        cameraMovement: 'Static',
        lensAndSpecs: '50mm Anamorphic T1.4',
        lightingMood: 'Soft phosphor green monitor glow illuminating Aris\'s tired face',
        sceneDescription: 'The oscilloscope console suddenly spikes into geometric fractals, repeating a prime-number harmonic cycle.',
        characterAction: 'Aris leans forward, pupils dilating, putting on the heavy acoustic telemetry headphones.',
        dialogue: {
          speaker: 'TELEMETRY CHIME',
          text: 'Resonance detected at 4.2 gigahertz. Origin point: Subsurface Trench Theta.'
        },
        soundDesign: 'Distorted hydrophone acoustic chime resembling crystalline bells under three miles of ice',
        musicCue: 'Sudden swelling bass pulse synchronized with monitor frequency',
        directorNote: 'Hold tight on eyes watching the screen reflection change.',
        visualColorTheme: {
          primary: '#022c22',
          secondary: '#34d399',
          accent: '#67e8f9',
          mood: 'Discovery'
        },
        compositionGuide: 'center-framed',
        silhouetteType: 'lone-figure'
      },
      {
        id: 'shot-space-3',
        shotNumber: 3,
        duration: 6,
        shotType: 'Extreme Wide Shot',
        cameraMovement: 'Tilt Down',
        lensAndSpecs: '18mm Ultra-Wide • Massive celestial depth',
        lightingMood: 'Bioluminescent cyan glow fracturing through deep crevasses in the ice sheets below',
        sceneDescription: 'Miles beneath the station, an immense triangular geometric structure illuminated with cyan conduits breaches the dark ice crust.',
        characterAction: 'The station\'s shadow glides silently across the colossal surface of the awakened artifact.',
        soundDesign: 'Deep tectonic groan muffled by vacuum, seismic rumbling shaking station bulkheads',
        musicCue: 'Epic choral crescendo with warm analog synthesizer pads',
        directorNote: 'Monumental reveal shot. Allow the majesty and dread to sit with the viewer.',
        visualColorTheme: {
          primary: '#09152a',
          secondary: '#06b6d4',
          accent: '#a855f7',
          mood: 'Cosmic Awe'
        },
        compositionGuide: 'golden-spiral',
        silhouetteType: 'landscape'
      },
      {
        id: 'shot-space-4',
        shotNumber: 4,
        duration: 4,
        shotType: 'Close-Up',
        cameraMovement: 'Steadicam Push',
        lensAndSpecs: '65mm Macro T2.0',
        lightingMood: 'Warm reflection of awakening alien structure dancing across Aris\'s visor',
        sceneDescription: 'Aris presses her hand against the double-paned insulated quartz window.',
        characterAction: 'A slow, wonder-filled smile touches her lips as she whispers into her comm badge.',
        dialogue: {
          speaker: 'DR. CHEN',
          text: 'Earth Station Houston... we are definitely not alone.'
        },
        soundDesign: 'Breath fogging on glass, soft static release on comm radio',
        musicCue: 'Harmonic resolution, majestic single piano chord ringing into silence',
        directorNote: 'End on the pure human emotion of contact.',
        visualColorTheme: {
          primary: '#111827',
          secondary: '#38bdf8',
          accent: '#f59e0b',
          mood: 'Transcendent'
        },
        compositionGuide: 'rule-of-thirds',
        silhouetteType: 'lone-figure'
      }
    ]
  },
  {
    id: 'film-noir-crossroads',
    title: 'Shadows on Blackwood Street',
    logline: 'A cynical 1948 private detective receives a water-damaged photograph that links the city\'s most corrupt magistrate to an unsolved dockside disappearance.',
    genre: 'Classic Film Noir',
    visualStyle: 'Monochrome High-Contrast Chiaroscuro',
    aspectRatio: '4:3',
    prompt: 'A 1940s private eye in a dimly lit office with Venetian blind shadows, confronted by a mysterious femme fatale holding a burning envelope.',
    estimatedRuntime: '0:18',
    createdAt: new Date().toISOString(),
    shots: [
      {
        id: 'shot-noir-1',
        shotNumber: 1,
        duration: 4,
        shotType: 'Medium Shot',
        cameraMovement: 'Static',
        lensAndSpecs: '40mm Vintage Cooke Speed Panchro • Deep Chiaroscuro',
        lightingMood: 'Slanted streetlight through dusty Venetian blinds carving zebra stripes across the office',
        sceneDescription: 'A cluttered detective office at 2 AM. Cigarette smoke swirls through the lamplight. On the frosted glass door, reversed letters read "J. MALONE - PRIVATE INQUIRIES".',
        characterAction: 'JACK MALONE leans back in his swivel chair, lighting a match with his thumbnail.',
        dialogue: {
          speaker: 'MALONE (V.O.)',
          text: 'Rain in this city doesn\'t wash away the dirt. It just gives it a fresh coat of grease.'
        },
        soundDesign: 'Rain tapping window glass, distant foghorn in the harbor, match strike sizzle',
        musicCue: 'Muted trumpet solo with melancholy brush snare rhythm',
        directorNote: 'Classic 1940s German Expressionism lighting. Hard shadows, rich velvety blacks.',
        visualColorTheme: {
          primary: '#171717',
          secondary: '#737373',
          accent: '#f59e0b',
          mood: 'Grim Noir'
        },
        compositionGuide: 'diagonal-lead',
        silhouetteType: 'lone-figure'
      },
      {
        id: 'shot-noir-2',
        shotNumber: 2,
        duration: 5,
        shotType: 'Over-the-Shoulder',
        cameraMovement: 'Pan Left',
        lensAndSpecs: '50mm Prime T1.8',
        lightingMood: 'Backlit doorway haloing the silhouette in mist',
        sceneDescription: 'The frosted glass door clicks open. Standing in the entrance is VIVIAN VANCE, clad in a dripping black trench coat and veiled brim hat.',
        characterAction: 'She steps inside without knocking, her leather-gloved hand resting on the brass door knob.',
        dialogue: {
          speaker: 'VIVIAN',
          text: 'They said you were cheap, Mr. Malone. They forgot to mention you were suicidal.'
        },
        soundDesign: 'Door hinges groaning, wet high heels stepping onto hardwood floor',
        musicCue: 'Low woodwinds enter with discordant mystery tension',
        directorNote: 'Keep her facial features obscured beneath the veil until she steps into the lamp radius.',
        visualColorTheme: {
          primary: '#0a0a0a',
          secondary: '#d4d4d8',
          accent: '#ffffff',
          mood: 'Fatal Mystery'
        },
        compositionGuide: 'rule-of-thirds',
        silhouetteType: 'two-characters'
      },
      {
        id: 'shot-noir-3',
        shotNumber: 3,
        duration: 4,
        shotType: 'Close-Up',
        cameraMovement: 'Tracking / Dolly',
        lensAndSpecs: '75mm Portrait Prime • Razor-sharp eye focus',
        lightingMood: 'Single key spotlight highlighting Vivian\'s emerald ring and the silver cigarette case',
        sceneDescription: 'Vivian slides an ash-singed manila envelope across Malone\'s desk. From inside spills a stamped negative plate.',
        characterAction: 'Malone holds the glass plate up to the tungsten lamp, his eyes widening as recognition hits.',
        dialogue: {
          speaker: 'MALONE',
          text: 'Where did you get this? The DA swore this evidence burned in the courthouse fire.'
        },
        soundDesign: 'Paper rustle, heavy glass negative clicking on mahogany desk',
        musicCue: 'Sudden sharp orchestral sting followed by anxious cello tremolo',
        directorNote: 'Camera creeps steadily toward Malone\'s eyes reflected in the glass negative.',
        visualColorTheme: {
          primary: '#18181b',
          secondary: '#a1a1aa',
          accent: '#fbbf24',
          mood: 'Tense Revelation'
        },
        compositionGuide: 'center-framed',
        silhouetteType: 'macro-detail'
      },
      {
        id: 'shot-noir-4',
        shotNumber: 4,
        duration: 5,
        shotType: 'Dutch Angle',
        cameraMovement: 'Handheld',
        lensAndSpecs: '28mm Wide Angle • 15 degree canted frame',
        lightingMood: 'Rapid headlights sweeping across the room through blinds, sudden darkness',
        sceneDescription: 'A black Packard sedan screeches to a stop in the street outside. Twin silhouetted gunmen exit into the rain with Tommy guns drawn.',
        characterAction: 'Malone kicks the desk lamp over, plunging the room into darkness as bullets shatter the exterior window.',
        dialogue: {
          speaker: 'MALONE',
          text: 'Hit the floor!'
        },
        soundDesign: 'Tire screech, shattering glass, loud bursts of automatic gunfire, thunder',
        musicCue: 'Explosive big-band action brass and driving timpani rolls',
        directorNote: 'High energy transition from slow dialogue burn into frantic survival.',
        visualColorTheme: {
          primary: '#09090b',
          secondary: '#ef4444',
          accent: '#facc15',
          mood: 'Sudden Chaos'
        },
        compositionGuide: 'diagonal-lead',
        silhouetteType: 'crowd'
      }
    ]
  }
];

export const PRESET_IDEAS = [
  {
    title: 'Neo-Tokyo Cyber Courier',
    genre: 'Cyberpunk Action',
    style: 'Neon-Noir 2.39:1',
    prompt: 'A rogue data courier racing across rainy neon rooftops in futuristic Neo-Tokyo, pursued by corporate stealth drones while carrying a pulsating quantum drive.',
    aspectRatio: '2.39:1' as const,
    shots: 6
  },
  {
    title: 'Europa Deep Trench',
    genre: 'Hard Sci-Fi Mystery',
    style: 'Kubrickian 70mm',
    prompt: 'A solitary astrobiologist in an orbital observation cupola discovering an ancient alien geometry surfacing through the ice of Europa.',
    aspectRatio: '16:9' as const,
    shots: 4
  },
  {
    title: 'Rain on Blackwood Street',
    genre: 'Classic Film Noir',
    style: 'Chiaroscuro 4:3',
    prompt: 'A 1940s private eye in a dimly lit office with Venetian blind shadows, confronted by a mysterious femme fatale holding a burning envelope.',
    aspectRatio: '4:3' as const,
    shots: 4
  },
  {
    title: 'Samurai Sunset Duel',
    genre: 'Historical Epic',
    style: 'Kurosawa Anamorphic',
    prompt: 'Two rival master swordsmen standing motionless in a field of golden pampas grass as the crimson sun sets behind Mount Fuji.',
    aspectRatio: '2.39:1' as const,
    shots: 5
  },
  {
    title: 'The Heist Getaway',
    genre: 'High-Octane Thriller',
    style: 'Fincher Precision',
    prompt: 'A bank heist crew in matching retro masks executing a synchronized vault breach under stadium strobe lights before escaping into the subway tunnels.',
    aspectRatio: '16:9' as const,
    shots: 5
  }
];
