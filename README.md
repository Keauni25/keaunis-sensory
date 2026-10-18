# keaunis-sensory

A playful nursery rhyme video project for YouTube with two versions:
- 2D colorful animal animation (SVG + JavaScript)
- 3D low-poly animal animation (Blender Python script)

This repo is designed to help you render a vibrant, sensory-friendly nursery rhyme video that is optimized for very young viewers: oversized shapes, high contrast, smooth movement, large clean typography, warm and bright colors, and soft visual pacing.

## Included

- 2D animated nursery rhyme scenes
- 3D Blender animation script for a stylized animal version
- TTS narration setup for natural-sounding voiceovers
- Music guidance for royalty-free background tracks
- Rendering instructions for local export to MP4

## Quick start

### 1) Install Node tools

```bash
npm install
```

### 2) Run the 2D scene preview locally

```bash
npm run 2d:serve
```

Then open the local URL shown in the terminal, usually http://localhost:4173 or http://localhost:8000.

### 3) Render the 2D video

```bash
npm run 2d:render
```

This uses Playwright to export PNG frames and FFmpeg to compile them into a video file in `output/`.

### 4) Generate narration

```bash
python3 -m pip install edge-tts
python3 scripts/tts_generate.py --voice "en-US-JennyNeural" --text-file scripts/lyrics.txt --output output/narration.mp3
```

### 5) 3D Blender render

Open Blender, then:

```bash
blender --background --python 3d/nursery_3d.py -- --output output/3d_render.mp4
```

For a more precise Blender workflow, open the script from the scripting tab and run it inside Blender.

## Folder structure

```text
.
├── README.md
├── package.json
├── .gitignore
├── scripts/
│   ├── lyrics.txt
│   ├── tts_generate.py
│   └── render_2d.mjs
├── 2d/
│   ├── index.html
│   ├── styles.css
│   └── scene.js
├── 3d/
│   └── nursery_3d.py
├── assets/
│   └── music/
│       └── README.md
└── output/
```

## Nursery rhyme flow

The default rhythm follows a baby-friendly sequence:

1. Twinkle Twinkle Little Star
2. Old MacDonald Had a Farm
3. Baa Baa Black Sheep
4. Itsy Bitsy Spider
5. Humpty Dumpty
6. Hickory Dickory Dock

Each segment is timed to a short, colorful animation sequence so the total runtime stays roughly 5 minutes.

## Color palette

This project intentionally uses high-contrast and attention-grabbing but soft, friendly colors:

- bright blue
- warm yellow
- vivid red
- teal
- magenta
- pastel green

These are chosen to be engaging for very young viewers while preserving readability and visual clarity.

## Voiceover note

The repo includes TTS generation using Microsoft Edge neural voices, which are more natural than generic robotic TTS and work well for a child-friendly style.

Recommended first voice:
- `en-US-JennyNeural`

## Music note

Use royalty-free music from sources such as:
- Pixabay Music (CC0 / royalty-free license)
- Mixkit (commercially safe with standard licensing)
- Artlist or Epidemic Sound only if you have the proper license

The `assets/music/README.md` file lists suggestions and safe-use notes.

## Rendering targets

Base settings:
- 1920x1080
- 30 fps
- MP4 export

If you want a higher frame rate or higher resolution later, the render pipeline can be adjusted in the scripts.

## License

The project is released under the MIT License for code, and all nursery lyrics used are public domain.

## Important note

This repo contains the complete render pipeline and production structure. The final export is generated locally on your machine using the included scripts.

For best results, keep your playback and render environment clean and ensure FFmpeg is installed.

---

Built for the `keaunis-sensory` project.


























































































































































































