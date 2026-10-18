import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname);
const outputDir = path.join(projectRoot, 'output');
const frameDir = path.join(outputDir, 'frames');
const videoPath = path.join(outputDir, 'keaunis_sensory_2d.mp4');

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(frameDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=egl']
});

const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  ignoreHTTPSErrors: true
});

const htmlPath = path.join(projectRoot, '2d', 'index.html');
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const totalFrames = 1800; // 60 seconds * 30fps // adjust if you want a longer render time
const fps = 30;

for (let i = 0; i < totalFrames; i++) {
  const t = (i / fps);
  await page.evaluate((seconds) => {
    const scene = document.querySelector('#scene');
    if (!scene) return;
    scene.style.filter = 'saturate(1.12) contrast(1.12) brightness(1.05)';
  }, t);

  const fileName = `frame_${String(i).padStart(5, '0')}.png`;
  const filePath = path.join(frameDir, fileName);
  await page.screenshot({ path: filePath, fullPage: false, animations: 'disabled' });
}

const ffmpegArgs = [
  '-y',
  '-framerate', String(fps),
  '-i', path.join(frameDir, 'frame_%05d.png'),
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-preset', 'medium',
  videoPath
];

execFileSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

console.log(`Rendered 2D video: ${videoPath}`);
await browser.close();
