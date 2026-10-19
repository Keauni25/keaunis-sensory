import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    duration: 280,
    fps: 30,
    width: 1920,
    height: 1080,
    music: '',
    narration: 'output/narration.mp3',
    output: 'output/final_youtube_ready.mp4',
    framesDir: 'output/frames',
    quality: 85
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--duration') out.duration = Number(args[++i]);
    if (a === '--fps') out.fps = Number(args[++i]);
    if (a === '--width') out.width = Number(args[++i]);
    if (a === '--height') out.height = Number(args[++i]);
    if (a === '--music') out.music = args[++i];
    if (a === '--narration') out.narration = args[++i];
    if (a === '--output') out.output = args[++i];
    if (a === '--framesDir') out.framesDir = args[++i];
    if (a === '--quality') out.quality = Number(args[++i]);
  }
  return out;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function ffmpegAvailable() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  const cfg = parseArgs();
  console.log('Render config:', cfg);

  if (!ffmpegAvailable()) {
    console.error('ffmpeg not found in PATH. Install ffmpeg and ensure it is available in your PATH.');
    process.exit(1);
  }

  const totalFrames = Math.round(cfg.duration * cfg.fps);
  const estimatedGB = (totalFrames * (cfg.quality / 100) * (cfg.width * cfg.height) * 3) / (1024 ** 3) * 0.000001; // rough and conservative
  console.log(`Rendering ${totalFrames} frames (~${cfg.duration}s at ${cfg.fps}fps).`);
  console.log('Estimated frame folder size: roughly 2–8 GB depending on frame quality and size.');

  const framesDir = path.resolve(cfg.framesDir);
  await ensureDir(framesDir);

  const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: cfg.width, height: cfg.height } });
  const page = await context.newPage();

  const htmlPath = path.resolve('2d', 'index.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Wait for the scene to initialize
  await page.waitForTimeout(1200);

  // If the page exposes a global sceneState and renderSceneByName, we'll use them for deterministic rendering.
  // Otherwise we'll fall back to letting the page animate and capturing screenshots in sequence.

  const hasRenderAPI = await page.evaluate(() => {
    return typeof window.sceneState !== 'undefined' && typeof window.renderSceneByName === 'function' && Array.isArray(window.segments);
  });

  console.log('Deterministic render API available on page:', hasRenderAPI);

  for (let i = 0; i < totalFrames; i++) {
    const seconds = i / cfg.fps;

    if (hasRenderAPI) {
      await page.evaluate(({ seconds }) => {
        const cfgSegmentDuration = window.sceneState && window.sceneState.segmentDuration ? window.sceneState.segmentDuration : 7.2;
        const idx = Math.floor(seconds / cfgSegmentDuration) % window.segments.length;
        const localT = seconds - Math.floor(seconds / cfgSegmentDuration) * cfgSegmentDuration;
        window.sceneState.index = idx;
        window.sceneState.timer = localT;
        const seg = window.segments[idx];
        if (seg) {
          if (window.mainTitle) window.mainTitle.textContent = seg.title || '';
          if (window.subtitle) window.subtitle.textContent = seg.subtitle || '';
          if (window.lyricText) window.lyricText.textContent = seg.text || '';
          if (typeof window.setTextColors === 'function') window.setTextColors(seg.palette || ['#fff','#fff','#fff']);
        }
        if (typeof window.renderSceneByName === 'function') window.renderSceneByName(seg.scene, localT);
      }, { seconds });
    } else {
      // If deterministic API not available, try to progress time naturally (best-effort)
      await page.waitForTimeout(1000 / cfg.fps);
    }

    const fileName = `frame_${String(i).padStart(8, '0')}.jpg`;
    const filePath = path.join(framesDir, fileName);

    await page.screenshot({ path: filePath, type: 'jpeg', quality: cfg.quality, fullPage: false });

    if ((i + 1) % Math.max(1, Math.floor(cfg.fps * 10)) === 0) {
      console.log(`Captured ${(i + 1)} / ${totalFrames} frames`);
    }
  }

  await browser.close();

  // Assemble frames into a temp video
  const tmpVideo = path.resolve('output', 'temp_video.mp4');
  console.log('Encoding frames to video (this may take a while)...');
  execFileSync('ffmpeg', [
    '-y',
    '-framerate', String(cfg.fps),
    '-i', path.join(framesDir, 'frame_%08d.jpg'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '18',
    tmpVideo
  ], { stdio: 'inherit' });

  // Mix final audio
  const finalOutput = path.resolve(cfg.output);

  const hasNarration = cfg.narration && (await fs.access(cfg.narration).then(() => true).catch(() => false));
  const hasMusic = cfg.music && (await fs.access(cfg.music).then(() => true).catch(() => false));

  if (!hasNarration && !hasMusic) {
    console.warn('No narration or music provided. Producing silent video.');
    execFileSync('ffmpeg', [
      '-y',
      '-i', tmpVideo,
      '-c:v', 'copy',
      finalOutput
    ], { stdio: 'inherit' });
  } else if (hasNarration && !hasMusic) {
    console.log('Adding narration only...');
    execFileSync('ffmpeg', [
      '-y',
      '-i', tmpVideo,
      '-i', cfg.narration,
      '-map', '0:v',
      '-map', '1:a',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-b:a', '192k',
      finalOutput
    ], { stdio: 'inherit' });
  } else if (hasNarration && hasMusic) {
    console.log('Mixing narration and music together...');
    // narration louder than music
    execFileSync('ffmpeg', [
      '-y',
      '-i', tmpVideo,
      '-i', cfg.narration,
      '-i', cfg.music,
      '-filter_complex', `[1:a]volume=1.0[a1];[2:a]volume=0.20[a2];[a1][a2]amix=inputs=2:duration=longest:dropout_transition=0,volume=1.0[a]`,
      '-map', '0:v',
      '-map', '[a]',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-b:a', '192k',
      finalOutput
    ], { stdio: 'inherit' });
  } else if (!hasNarration && hasMusic) {
    console.log('Adding music only...');
    execFileSync('ffmpeg', [
      '-y',
      '-i', tmpVideo,
      '-i', cfg.music,
      '-map', '0:v',
      '-map', '1:a',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-b:a', '192k',
      finalOutput
    ], { stdio: 'inherit' });
  }

  console.log('Final file created:', finalOutput);
  console.log('You can now upload this MP4 to YouTube.');
}

main().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
