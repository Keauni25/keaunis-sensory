const lyricSegments = [
  {
    text: 'Twinkle, twinkle, little star',
    duration: 6.2,
    palette: ['#ffd75d', '#7b68ee', '#ff6b8a'],
    scene: 'stars'
  },
  {
    text: 'Old MacDonald had a farm',
    duration: 7.2,
    palette: ['#ffd75d', '#3ecf8e', '#ff9021'],
    scene: 'farm'
  },
  {
    text: 'Baa, baa, black sheep',
    duration: 6.0,
    palette: ['#1e1f36', '#8ecae6', '#ffd54a'],
    scene: 'sheep'
  },
  {
    text: 'Itsy bitsy spider climbed up the spout',
    duration: 6.8,
    palette: ['#ff6f61', '#ffd166', '#73d2de'],
    scene: 'spider'
  },
  {
    text: 'Humpty Dumpty sat on a wall',
    duration: 6.6,
    palette: ['#fca311', '#ff7b7b', '#ffedd1'],
    scene: 'humpty'
  },
  {
    text: 'Hickory, dickory, dock',
    duration: 5.8,
    palette: ['#38bdf8', '#fda4af', '#a78bfa'],
    scene: 'clock'
  }
];

const animalDefs = {
  sheep: { color: '#2f2f45', accent: '#ffffff', ear: '#f3d7b8' },
  cow: { color: '#f5f5f5', accent: '#3a3a3a', ear: '#d7d7d7' },
  pig: { color: '#ffb3c6', accent: '#ffffff', ear: '#f7d3d9' },
  chicken: { color: '#f8e59d', accent: '#f08080', ear: '#e7d0a8' },
  spider: { color: '#4b2d5f', accent: '#f5c2ff', ear: '#9d7cc5' },
  duck: { color: '#ffd166', accent: '#f0ff52', ear: '#f1c96c' }
};

const svgNS = 'http://www.w3.org/2000/svg';
const animalsLayer = document.getElementById('sceneAnimals');
const lyricText = document.getElementById('lyricText');
const title = document.getElementById('mainTitle');
const subtitle = document.getElementById('subtitle');

let activeScene = 0;
let state = {
  time: 0,
  start: 0,
  currentIndex: 0,
  phase: 0
};

function createAnimal(type, x, y, scale = 1, className = '') {
  const animal = document.createElementNS(svgNS, 'g');
  animal.setAttribute('class', `char ${className}`);
  animal.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);

  const body = document.createElementNS(svgNS, 'ellipse');
  const face = document.createElementNS(svgNS, 'circle');
  const eyeLeft = document.createElementNS(svgNS, 'circle');
  const eyeRight = document.createElementNS(svgNS, 'circle');
  const smile = document.createElementNS(svgNS, 'path');
  const earLeft = document.createElementNS(svgNS, 'circle');
  const earRight = document.createElementNS(svgNS, 'circle');
  const leg1 = document.createElementNS(svgNS, 'rect');
  const leg2 = document.createElementNS(svgNS, 'rect');
  const leg3 = document.createElementNS(svgNS, 'rect');
  const leg4 = document.createElementNS(svgNS, 'rect');

  const defs = animalDefs[type] || animalDefs.sheep;

  body.setAttribute('cx', '0');
  body.setAttribute('cy', '0');
  body.setAttribute('rx', '70');
  body.setAttribute('ry', '52');
  body.setAttribute('fill', defs.color);
  body.setAttribute('stroke', '#1e1e1e');
  body.setAttribute('stroke-width', '4');

  face.setAttribute('cx', '0');
  face.setAttribute('cy', '-16');
  face.setAttribute('r', '36');
  face.setAttribute('fill', defs.accent);

  eyeLeft.setAttribute('cx', '-12');
  eyeLeft.setAttribute('cy', '-18');
  eyeLeft.setAttribute('r', '5');
  eyeLeft.setAttribute('fill', '#111');

  eyeRight.setAttribute('cx', '12');
  eyeRight.setAttribute('cy', '-18');
  eyeRight.setAttribute('r', '5');
  eyeRight.setAttribute('fill', '#111');

  smile.setAttribute('d', 'M -16 4 Q 0 18 16 4');
  smile.setAttribute('fill', 'none');
  smile.setAttribute('stroke', '#111');
  smile.setAttribute('stroke-width', '4');
  smile.setAttribute('stroke-linecap', 'round');

  earLeft.setAttribute('cx', '-28');
  earLeft.setAttribute('cy', '-60');
  earLeft.setAttribute('r', '10');
  earLeft.setAttribute('fill', defs.ear);

  earRight.setAttribute('cx', '28');
  earRight.setAttribute('cy', '-60');
  earRight.setAttribute('r', '10');
  earRight.setAttribute('fill', defs.ear);

  leg1.setAttribute('x', '-36');
  leg1.setAttribute('y', '42');
  leg1.setAttribute('width', '12');
  leg1.setAttribute('height', '38');
  leg1.setAttribute('rx', '6');
  leg1.setAttribute('fill', defs.accent);

  leg2.setAttribute('x', '-12');
  leg2.setAttribute('y', '42');
  leg2.setAttribute('width', '12');
  leg2.setAttribute('height', '38');
  leg2.setAttribute('rx', '6');
  leg2.setAttribute('fill', defs.accent);

  leg3.setAttribute('x', '12');
  leg3.setAttribute('y', '42');
  leg3.setAttribute('width', '12');
  leg3.setAttribute('height', '38');
  leg3.setAttribute('rx', '6');
  leg3.setAttribute('fill', defs.accent);

  leg4.setAttribute('x', '36');
  leg4.setAttribute('y', '42');
  leg4.setAttribute('width', '12');
  leg4.setAttribute('height', '38');
  leg4.setAttribute('rx', '6');
  leg4.setAttribute('fill', defs.accent);

  animal.appendChild(body);
  animal.appendChild(face);
  animal.appendChild(earLeft);
  animal.appendChild(earRight);
  animal.appendChild(eyeLeft);
  animal.appendChild(eyeRight);
  animal.appendChild(smile);
  animal.appendChild(leg1);
  animal.appendChild(leg2);
  animal.appendChild(leg3);
  animal.appendChild(leg4);

  return animal;
}

function createStar(x, y, radius, fill = '#ffd75d') {
  const star = document.createElementNS(svgNS, 'g');
  star.setAttribute('class', 'star');
  star.setAttribute('transform', `translate(${x} ${y})`);

  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * 0.5;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    points.push(`${px},${py}`);
  }

  const polygon = document.createElementNS(svgNS, 'polygon');
  polygon.setAttribute('points', points.join(' '));
  polygon.setAttribute('fill', fill);
  polygon.setAttribute('stroke', '#fff6b7');
  polygon.setAttribute('stroke-width', '3');
  star.appendChild(polygon);

  return star;
}

function clearAnimals() {
  while (animalsLayer.firstChild) {
    animalsLayer.removeChild(animalsLayer.firstChild);
  }
}

function renderSceneStars(t) {
  clearAnimals();
  for (let i = 0; i < 12; i++) {
    const star = createStar(250 + i * 130, 180 + (i % 3) * 80, 24 + (i % 5) * 6, i % 2 ? '#ffd75d' : '#f9b2ff');
    star.setAttribute('transform', `translate(${250 + i * 130} ${180 + (i % 3) * 80}) scale(${0.9 + Math.sin(t * 2 + i) * 0.15})`);
    animalsLayer.appendChild(star);
  }

  const moon = document.createElementNS(svgNS, 'circle');
  moon.setAttribute('cx', '1500');
  moon.setAttribute('cy', '200');
  moon.setAttribute('r', '80');
  moon.setAttribute('fill', '#fff0c3');
  moon.setAttribute('opacity', '0.85');
  animalsLayer.appendChild(moon);
}

function renderSceneFarm(t) {
  clearAnimals();
  ['cow', 'pig', 'chicken', 'duck'].forEach((type, i) => {
    const animal = createAnimal(type, 330 + i * 320, 760, 1.2, 'jump');
    animal.setAttribute('transform', `translate(${330 + i * 320} ${760 + Math.sin(t * 4 + i) * 12}) scale(1.25)`);
    animalsLayer.appendChild(animal);
  });

  const barn = document.createElementNS(svgNS, 'g');
  const barnBody = document.createElementNS(svgNS, 'rect');
  barnBody.setAttribute('x', '1170');
  barnBody.setAttribute('y', '520');
  barnBody.setAttribute('width', '240');
  barnBody.setAttribute('height', '200');
  barnBody.setAttribute('rx', '18');
  barnBody.setAttribute('fill', '#d59757');
  barnBody.setAttribute('stroke', '#8a4d18');
  barnBody.setAttribute('stroke-width', '6');

  const roof = document.createElementNS(svgNS, 'polygon');
  roof.setAttribute('points', '1140,520 1290,430 1440,520');
  roof.setAttribute('fill', '#b75d2e');
  roof.setAttribute('stroke', '#7f3b19');
  roof.setAttribute('stroke-width', '6');

  const door = document.createElementNS(svgNS, 'rect');
  door.setAttribute('x', '1260');
  door.setAttribute('y', '620');
  door.setAttribute('width', '70');
  door.setAttribute('height', '100');
  door.setAttribute('rx', '8');
  door.setAttribute('fill', '#7f4d1d');

  barn.appendChild(roof);
  barn.appendChild(barnBody);
  barn.appendChild(door);
  animalsLayer.appendChild(barn);
}

function renderSceneSheep(t) {
  clearAnimals();
  for (let i = 0; i < 4; i++) {
    const sheep = createAnimal('sheep', 350 + i * 350, 780 - Math.sin(t * 5 + i) * 18, 1.1, 'jump');
    sheep.setAttribute('transform', `translate(${350 + i * 350} ${780 - Math.sin(t * 5 + i) * 18}) scale(1.1)`);
    animalsLayer.appendChild(sheep);
  }
}

function renderSceneSpider(t) {
  clearAnimals();
  const spider = createAnimal('spider', 980, 620, 1.3, 'jump');
  spider.setAttribute('transform', `translate(980 ${620 - Math.sin(t * 6) * 12}) scale(1.3)`);
  animalsLayer.appendChild(spider);

  const web = document.createElementNS(svgNS, 'path');
  web.setAttribute('d', 'M 700 250 Q 980 160 1260 250');
  web.setAttribute('fill', 'none');
  web.setAttribute('stroke', '#f6e7ff');
  web.setAttribute('stroke-width', '4');
  web.setAttribute('stroke-dasharray', '12 18');
  animalsLayer.appendChild(web);

  for (let i = 0; i < 8; i++) {
    const line = document.createElementNS(svgNS, 'line');
    const x = 700 + i * 80;
    line.setAttribute('x1', String(x));
    line.setAttribute('y1', '250');
    line.setAttribute('x2', String(980 + i * 12));
    line.setAttribute('y2', '850');
    line.setAttribute('stroke', 'rgba(255,255,255,0.55)');
    line.setAttribute('stroke-width', '2');
    animalsLayer.appendChild(line);
  }
}

function renderSceneHumpty(t) {
  clearAnimals();
  const wall = document.createElementNS(svgNS, 'rect');
  wall.setAttribute('x', '350');
  wall.setAttribute('y', '430');
  wall.setAttribute('width', '1220');
  wall.setAttribute('height', '170');
  wall.setAttribute('rx', '20');
  wall.setAttribute('fill', '#f5d7a6');
  wall.setAttribute('stroke', '#b77a32');
  wall.setAttribute('stroke-width', '8');
  animalsLayer.appendChild(wall);

  const egg = document.createElementNS(svgNS, 'ellipse');
  egg.setAttribute('cx', '960');
  egg.setAttribute('cy', '420');
  egg.setAttribute('rx', '70');
  egg.setAttribute('ry', '110');
  egg.setAttribute('fill', '#fefcf0');
  egg.setAttribute('stroke', '#d6b77a');
  egg.setAttribute('stroke-width', '8');
  animalsLayer.appendChild(egg);

  const face = document.createElementNS(svgNS, 'circle');
  face.setAttribute('cx', '960');
  face.setAttribute('cy', '380');
  face.setAttribute('r', '16');
  face.setAttribute('fill', '#111');
  animalsLayer.appendChild(face);

  const mouth = document.createElementNS(svgNS, 'path');
  mouth.setAttribute('d', 'M 944 400 Q 960 410 976 400');
  mouth.setAttribute('fill', 'none');
  mouth.setAttribute('stroke', '#111');
  mouth.setAttribute('stroke-width', '5');
  mouth.setAttribute('stroke-linecap', 'round');
  animalsLayer.appendChild(mouth);
}

function renderSceneClock(t) {
  clearAnimals();
  const clock = document.createElementNS(svgNS, 'g');
  const ring = document.createElementNS(svgNS, 'circle');
  ring.setAttribute('cx', '960');
  ring.setAttribute('cy', '500');
  ring.setAttribute('r', '180');
  ring.setAttribute('fill', '#fff8dd');
  ring.setAttribute('stroke', '#f5a623');
  ring.setAttribute('stroke-width', '12');
  clock.appendChild(ring);

  for (let i = 0; i < 12; i++) {
    const tick = document.createElementNS(svgNS, 'line');
    const angle = (Math.PI / 6) * i - Math.PI / 2;
    const innerX = 960 + Math.cos(angle) * 135;
    const innerY = 500 + Math.sin(angle) * 135;
    const outerX = 960 + Math.cos(angle) * 170;
    const outerY = 500 + Math.sin(angle) * 170;
    tick.setAttribute('x1', innerX);
    tick.setAttribute('y1', innerY);
    tick.setAttribute('x2', outerX);
    tick.setAttribute('y2', outerY);
    tick.setAttribute('stroke', '#6c4f9b');
    tick.setAttribute('stroke-width', '6');
    clock.appendChild(tick);
  }

  const handMinutes = document.createElementNS(svgNS, 'line');
  handMinutes.setAttribute('x1', '960');
  handMinutes.setAttribute('y1', '500');
  handMinutes.setAttribute('x2', String(960 + Math.cos(t * 2.5) * 120));
  handMinutes.setAttribute('y2', String(500 + Math.sin(t * 2.5) * 120));
  handMinutes.setAttribute('stroke', '#6c4f9b');
  handMinutes.setAttribute('stroke-width', '14');
  handMinutes.setAttribute('stroke-linecap', 'round');
  clock.appendChild(handMinutes);

  const handHours = document.createElementNS(svgNS, 'line');
  handHours.setAttribute('x1', '960');
  handHours.setAttribute('y1', '500');
  handHours.setAttribute('x2', String(960 + Math.cos((t * 2.5) / 12) * 80));
  handHours.setAttribute('y2', String(500 + Math.sin((t * 2.5) / 12) * 80));
  handHours.setAttribute('stroke', '#ef476f');
  handHours.setAttribute('stroke-width', '10');
  handHours.setAttribute('stroke-linecap', 'round');
  clock.appendChild(handHours);

  const center = document.createElementNS(svgNS, 'circle');
  center.setAttribute('cx', '960');
  center.setAttribute('cy', '500');
  center.setAttribute('r', '16');
  center.setAttribute('fill', '#ff7b7b');
  clock.appendChild(center);

  animalsLayer.appendChild(clock);

  const mouse = createAnimal('duck', 1100, 700, 1.0, 'jump');
  mouse.setAttribute('transform', `translate(1100 ${700 + Math.sin(t * 4) * 18}) scale(1.0)`);
  animalsLayer.appendChild(mouse);
}

function renderCurrentScene(t) {
  const scene = lyricSegments[state.currentIndex];
  if (!scene) return;

  if (scene.scene === 'stars') renderSceneStars(t);
  if (scene.scene === 'farm') renderSceneFarm(t);
  if (scene.scene === 'sheep') renderSceneSheep(t);
  if (scene.scene === 'spider') renderSceneSpider(t);
  if (scene.scene === 'humpty') renderSceneHumpty(t);
  if (scene.scene === 'clock') renderSceneClock(t);

  const palette = scene.palette || ['#ffd75d', '#7b68ee', '#ff6b8a'];
  document.documentElement.style.setProperty('--primary', palette[0]);
  document.documentElement.style.setProperty('--secondary', palette[1]);
  document.documentElement.style.setProperty('--accent', palette[2]);
}

function updateLyrics() {
  const active = lyricSegments[state.currentIndex];
  if (!active) return;
  lyricText.textContent = active.text;
  title.setAttribute('fill', active.palette[0]);
  subtitle.setAttribute('fill', active.palette[1]);
}

function tick(now) {
  if (!state.start) state.start = now;

  state.time = (now - state.start) / 1000;
  const segment = lyricSegments[state.currentIndex];
  if (!segment) return;

  if (state.time > segment.duration) {
    state.currentIndex = (state.currentIndex + 1) % lyricSegments.length;
    state.start = now;
    updateLyrics();
  }

  const localT = (now - state.start) / 1000;
  renderCurrentScene(localT);
  requestAnimationFrame(tick);
}

updateLyrics();
requestAnimationFrame(tick);
