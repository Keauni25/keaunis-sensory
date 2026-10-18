A polished, child-friendly nursery rhyme video project for YouTube with:
- 2D sensory animation using SVG + JavaScript
- 3D Blender scene starter for a second version
- natural-sounding narration setup
- royalty-free music guidance
- render workflow for 1920×1080 export

The project is intended for very young viewers, with high-contrast colors, large rounded shapes, calm motion, and friendly animal characters.

## Project goal

Create a ~5-minute nursery rhyme experience featuring bright, engaging animal characters and warm, high-contrast visuals, designed to attract a baby’s attention without overstimulating the viewer.

## Included

- 2D scene system for a nursery rhyme sequence
- friendly animal character art and SVG starter assets
- a 3D Blender scene base for a stylized alternative version
- narration generation script using Edge TTS for more natural-sounding voices
- royalty-free music notes and safe-use guidance
- render steps for local MP4 export

## Recommended local setup

### Install Node dependencies

```bash
npm install
```

### Start the 2D preview locally

```bash
npm run 2d:serve
```

This serves the 2D project from the `2d/` folder. Open the local URL shown in the terminal.

### Render the 2D video

```bash
npm run 2d:render
```

This captures frames with Playwright and exports an MP4 with FFmpeg.

### Generate narration audio

```bash
python3 -m pip install edge-tts
python3 scripts/tts_generate.py --voice "en-US-JennyNeural" --text-file scripts/lyrics.txt --output output/narration.mp3
```

### Blender 3D render

Open Blender and run:

```bash
blender --background --python 3d/nursery_3d.py -- --output output/3d_render.mp4
```

## Nursery rhyme sequence

The studio flow is:
1. Twinkle Twinkle Little Star
2. Old MacDonald Had a Farm
3. Baa Baa Black Sheep
4. Itsy Bitsy Spider
5. Humpty Dumpty
6. Hickory Dickory Dock

Each segment gets a short, visually friendly animation rhythm to keep the total runtime near 5 minutes.

## Style goals

- warm bright colors: yellow, blue, coral, green, magenta
- rounded forms and big facial features
- high readability on screen
- motion that is slow, smooth, and easy to track
- gentle loops and light background movement

## File overview

```text
.
├── README.md
├── package.json
├── scripts/
│   ├── lyrics.txt
│   ├── storyboard.md
│   ├── render_2d.mjs
│   └── tts_generate.py
├── 2d/
│   ├── index.html
│   ├── styles.css
│   └── scene.js
├── 3d/
│   └── nursery_3d.py
├── assets/
│   ├── svg/
│   └── music/
│       └── README.md
├── output/
└── .gitignore
```

## Required tools

- Node.js
- FFmpeg
- Python 3
- Blender (for 3D version)
- Playwright
- Edge TTS

## Notes

- The repo is designed to render locally on your machine.
- TTS output can be more natural sounding than a generic robot voice when using Edge TTS or another neural voice service.
- The music should be royalty-free and safe for YouTube; keep it lower in volume than narration.

## License

- Project code: MIT
- Nursery lyrics: public domain
- Royalty-free music: use the source license for each track you include

This project is intended as a full local production starter for `keaunis-sensory`.
