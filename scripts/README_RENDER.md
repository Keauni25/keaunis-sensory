Final render instructions (automated)

We've added a deterministic, robust 2D rendering script that:
- Captures frames as JPEG to save disk space
- Uses Playwright to open the 2D scene and set the internal scene timer for consistent frames
- Encodes frames to H.264 via ffmpeg
- Mixes narration and music into a final YouTube-ready MP4

Quick run (after installing dependencies and generating narration/music):

npm install
npx playwright install

# generate narration (example)
python3 -m pip install edge-tts
python3 scripts/tts_generate.py --voice "en-US-JennyNeural" --text-file scripts/lyrics.txt --output output/narration.mp3

# put music in output/music/soft_kids_piano.mp3

# run the final renderer (this will create ~280s video at 30fps by default)
npm run 2d:render-final

Optional flags are supported for render_final.mjs (override defaults):
- --duration <seconds>
- --fps <frames-per-second>
- --width <px>
- --height <px>
- --music <path-to-music>
- --narration <path-to-narration>
- --output <output-mp4-path>
- --framesDir <temp-frames-dir>
- --quality <jpeg-quality 10-100>

Example custom usage:
node scripts/render_final.mjs --duration 300 --fps 30 --narration output/narration.mp3 --music output/music/soft_kids_piano.mp3 --output output/my_final_video.mp4

Notes & recommendations:
- Ensure ffmpeg is installed and available on PATH.
- Expect several GB of temporary frames. Use the --framesDir option to place frames on a drive with sufficient space.
- If your machine struggles, reduce resolution to 1280x720 (`--width 1280 --height 720`) or reduce fps to 24.
- If you need a faster but lower-quality pass for preview, set `--quality 60`.

After the script finishes, the file at the path you passed to --output is ready for upload to YouTube.
