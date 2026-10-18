const svgNS = 'http://www.w3.org/2000/svg';
const sceneCharacters = document.getElementById('sceneCharacters');
const cloudGroup = document.getElementById('cloudGroup');
const hillsGroup = document.getElementById('hillsGroup');
const lyricText = document.getElementById('lyricText');
const mainTitle = document.getElementById('mainTitle');
const subtitle = document.getElementById('subtitle');

const segments = [
  { title: 'Keaunis Sensory', subtitle: 'Nursery Rhymes', text: 'Twinkle, twinkle, little star', palette: ['#ffd75d', '#7c6df2', '#ff7e9f'], scene: 'stars' },
  { title: 'Old MacDonald', subtitle: 'Had a farm', text: 'Old MacDonald had a farm', palette: ['#ffe06d', '#5fd18d', '#ff9d5c'], scene: 'farm' },
  { title: 'Baa Baa', subtitle: 'Black Sheep', text: 'Baa, baa, black sheep', palette: ['#3a3b6d', '#8ad6ff', '#ffd166'], scene: 'sheep' },
  { title: 'Itsy Bitsy', subtitle: 'Spider', text: 'Itsy bitsy spider climbed up the spout', palette: ['#ff7f7f', '#ffd166', '#7fd4ff'], scene: 'spider' },
  { title: 'Humpty Dumpty', subtitle: 'On the wall', text: 'Humpty Dumpty sat on a wall', palette: ['#fca311', '#ff8a80', '#fff0d9'], scene: 'humpty' },
  { title: 'Hickory Dickory', subtitle: 'Dock', text: 'Hickory, dickory, dock', palette: ['#5cc2ff', '#ff9db4', '#b6a7ff'], scene: 'clock' }
];

const sceneState = {
  index: 0,
  timer: 0,
  lastFrame: 0,
  segmentDuration: 7.2
};

function setTextColors(palette) {
  mainTitle.setAttribute('fill', palette[0]);
  subtitle.setAttribute('fill', palette[1]);
  lyricText.setAttribute('fill', '#ffffff');
}

function createCloud(x, y, scale, opacity = 1) {
  const g = document.createElementNS(svgNS, 'g');
  g.setAttribute('class', 'cloud');
  g.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
  g.setAttribute('opacity', opacity);

  const circle1 = document.createElementNS(svgNS, 'circle');
  circle1.setAttribute('cx', '0');
  circle1.setAttribute('cy', '0');
  circle1.setAttribute('r', '42');
  circle1.setAttribute('fill', '#ffffff');

  const circle2 = document.createElementNS(svgNS, 'circle');
  circle2.setAttribute('cx', '46');
  circle2.setAttribute('cy', '-12');
  circle2.setAttribute('r', '36');
  circle2.setAttribute('fill', '#ffffff');

  const circle3 = document.createElementNS(svgNS, 'circle');
  circle3.setAttribute('cx', '90');
  circle3.setAttribute('cy', '8');
  circle3.setAttribute('r', '30');
  circle3.setAttribute('fill', '#ffffff');

  const base = document.createElementNS(svgNS, 'rect');
  base.setAttribute('x', '-18');
  base.setAttribute('y', '18');
  base.setAttribute('width', '128');
  base.setAttribute('height', '42');
  base.setAttribute('rx', '20');
  base.setAttribute('fill', '#ffffff');

  g.append(circle1, circle2, circle3, base);
  return g;
}

function createHill(x, y, width, height, color) {
  const g = document.createElementNS(svgNS, 'g');
  const hill = document.createElementNS(svgNS, 'path');
  hill.setAttribute('d', `M ${x} ${y} Q ${x + width * 0.5} ${y - height} ${x + width} ${y} L ${x + width} 1080 L ${x} 1080 Z`);
  hill.setAttribute('fill', color);
  g.appendChild(hill);
  return g;
}

function drawBackground() {
  cloudGroup.innerHTML = '';
  hillsGroup.innerHTML = '';

  const cloudPositions = [
    [260, 160, 1.0, 0.8],
    [775, 215, 1.2, 0.9],
    [1350, 180, 0.9, 0.7]
  ];

  cloudPositions.forEach(([x, y, scale, opacity]) => {
    cloudGroup.appendChild(createCloud(x, y, scale, opacity));
  });

  const hillData = [
    [0, 760, 780, 150, '#7bd588'],
    [600, 720, 900, 180, '#76ca7d'],
    [1200, 760, 700, 150, '#67b86d']
  ];

  hillData.forEach(([x, y, width, height, color]) => {
    hillsGroup.appendChild(createHill(x, y, width, height, color));
  });
}

function createFriendlyAnimal(type, x, y, scale = 1, tilt = 0, bounce = 0) {
  const g = document.createElementNS(svgNS, 'g');
  g.setAttribute('class', 'character floaty');
  g.setAttribute('transform', `translate(${x} ${y}) rotate(${tilt}) scale(${scale})`);

  const body = document.createElementNS(svgNS, 'ellipse');
  const face = document.createElementNS(svgNS, 'circle');
  const earL = document.createElementNS(svgNS, 'circle');
  const earR = document.createElementNS(svgNS, 'circle');
  const eyeL = document.createElementNS(svgNS, 'circle');
  const eyeR = document.createElementNS(svgNS, 'circle');
  const smile = document.createElementNS(svgNS, 'path');
  const nose = document.createElementNS(svgNS, 'circle');
  const leg1 = document.createElementNS(svgNS, 'rect');
  const leg2 = document.createElementNS(svgNS, 'rect');
  const leg3 = document.createElementNS(svgNS, 'rect');
  const leg4 = document.createElementNS(svgNS, 'rect');

  const palette = {
    sheep: { body: '#f9fbff', face: '#f6f3ff', ear: '#f3d7bf', accent: '#7d94ff', eye: '#201a26' },
    cow: { body: '#f5efe9', face: '#fff8ee', ear: '#d19563', accent: '#4d4d5e', eye: '#222222' },
    pig: { body: '#ffbfd2', face: '#ffdfe9', ear: '#f4b7c9', accent: '#ff8ca1', eye: '#2a2229' },
    chicken: { body: '#f7e788', face: '#fff3bc', ear: '#f8d89f', accent: '#ff8a5b', eye: '#1f1f1f' },
    spider: { body: '#5d3b7c', face: '#7f4bab', ear: '#d9c1ff', accent: '#dcb7ff', eye: '#0c0c0c' },
    duck: { body: '#ffd765', face: '#fff3b1', ear: '#f4c778', accent: '#7fd8ff', eye: '#1b1b1b' },
    lamb: { body: '#ffffff', face: '#f4f4ff', ear: '#f2d5be', accent: '#8b91ff', eye: '#1d1d1d' },
    star: { body: '#ffd75d', face: '#fff0ad', ear: '#ffd75d', accent: '#ff8a5b', eye: '#1d1d1d' },
    mouse: { body: '#fff1e6', face: '#ffefe1', ear: '#f0d3c5', accent: '#ffad8d', eye: '#1d1d1d' },
    egg: { body: '#fffaf0', face: '#fffaf0', ear: '#f5d9a8', accent: '#ffb778', eye: '#191919' }
  }[type] || palette.sheep;

  body.setAttribute('cx', '0');
  body.setAttribute('cy', '20');
  body.setAttribute('rx', type === 'egg' ? 72 : 100);
  body.setAttribute('ry', type === 'egg' ? 94 : 84);
  body.setAttribute('fill', palette.body);
  body.setAttribute('stroke', 'rgba(36,36,36,0.18)');
  body.setAttribute('stroke-width', '5');

  face.setAttribute('cx', '0');
  face.setAttribute('cy', '-8');
  face.setAttribute('r', type === 'spider' ? 38 : type === 'egg' ? 42 : 44);
  face.setAttribute('fill', palette.face);
  face.setAttribute('stroke', 'rgba(36,36,36,0.08)');
  face.setAttribute('stroke-width', '3');

  earL.setAttribute('cx', type === 'spider' ? '-34' : '-30');
  earL.setAttribute('cy', type === 'spider' ? '-52' : '-62');
  earL.setAttribute('r', type === 'spider' ? 8 : 12);
  earL.setAttribute('fill', palette.ear);

  earR.setAttribute('cx', type === 'spider' ? '34' : '30');
  earR.setAttribute('cy', type === 'spider' ? '-52' : '-62');
  earR.setAttribute('r', type === 'spider' ? 8 : 12);
  earR.setAttribute('fill', palette.ear);

  eyeL.setAttribute('cx', type === 'egg' ? '-18' : '-18');
  eyeL.setAttribute('cy', '-18');
  eyeL.setAttribute('r', '6');
  eyeL.setAttribute('fill', palette.eye);

  eyeR.setAttribute('cx', '18');
  eyeR.setAttribute('cy', '-18');
  eyeR.setAttribute('r', '6');
  eyeR.setAttribute('fill', palette.eye);

  nose.setAttribute('cx', '0');
  nose.setAttribute('cy', '-2');
  nose.setAttribute('r', type === 'egg' ? 4 : 5);
  nose.setAttribute('fill', palette.accent);

  smile.setAttribute('d', 'M -22 14 Q 0 32 22 14');
  smile.setAttribute('fill', 'none');
  smile.setAttribute('stroke', '#222');
  smile.setAttribute('stroke-width', '5');
  smile.setAttribute('stroke-linecap', 'round');

  leg1.setAttribute('x', '-42');
  leg1.setAttribute('y', '72');
  leg1.setAttribute('width', '16');
  leg1.setAttribute('height', '32');
  leg1.setAttribute('rx', '8');
  leg1.setAttribute('fill', '#e4eaf7');

  leg2.setAttribute('x', '-12');
  leg2.setAttribute('y', '72');
  leg2.setAttribute('width', '16');
  leg2.setAttribute('height', '32');
  leg2.setAttribute('rx', '8');
  leg2.setAttribute('fill', '#e4eaf7');

  leg3.setAttribute('x', '12');
  leg3.setAttribute('y', '72');
  leg3.setAttribute('width', '16');
  leg3.setAttribute('height', '32');
  leg3.setAttribute('rx', '8');
  leg3.setAttribute('fill', '#e4eaf7');

  leg4.setAttribute('x', '42');
  leg4.setAttribute('y', '72');
  leg4.setAttribute('width', '16');
  leg4.setAttribute('height', '32');
  leg4.setAttribute('rx', '8');
  leg4.setAttribute('fill', '#e4eaf7');

  g.append(body, face, earL, earR, eyeL, eyeR, nose, smile, leg1, leg2, leg3, leg4);

  if (type === 'spider') {
    const web1 = document.createElementNS(svgNS, 'line');
    const web2 = document.createElementNS(svgNS, 'line');
    web1.setAttribute('x1', '-48'); web1.setAttribute('y1', '110'); web1.setAttribute('x2', '-48'); web1.setAttribute('y2', '230');
    web2.setAttribute('x1', '48'); web2.setAttribute('y1', '110'); web2.setAttribute('x2', '48'); web2.setAttribute('y2', '230');
    web1.setAttribute('stroke', '#f1d9ff'); web1.setAttribute('stroke-width', '4');
    web2.setAttribute('stroke', '#f1d9ff'); web2.setAttribute('stroke-width', '4');
    g.append(web1, web2);
  }

  return g;
}

function clearScene() {
  sceneCharacters.innerHTML = '';
}

function renderStars(t) {
  clearScene();
  const starColors = ['#ffd75d', '#ffe7a3', '#ff9ac5', '#a4d4ff'];
  for (let i = 0; i < 12; i++) {
    const star = document.createElementNS(svgNS, 'g');
    star.setAttribute('transform', `translate(${200 + i * 130} ${150 + (i % 3) * 120}) scale(${0.8 + (i % 3) * 0.2})`);
    const poly = document.createElementNS(svgNS, 'polygon');
    const points = [];
    for (let j = 0; j < 10; j++) {
      const angle = (Math.PI / 5) * j - Math.PI / 2;
      const rad = j % 2 === 0 ? 28 : 12;
      points.push(`${Math.cos(angle) * rad},${Math.sin(angle) * rad}`);
    }
    poly.setAttribute('points', points.join(' '));
    poly.setAttribute('fill', starColors[i % starColors.length]);
    poly.setAttribute('stroke', '#fff0b3');
    poly.setAttribute('stroke-width', '4');
    star.appendChild(poly);
    sceneCharacters.appendChild(star);
  }

  const lamb = createFriendlyAnimal('lamb', 960, 760, 1.15, 0, 0);
  sceneCharacters.appendChild(lamb);
  const bird = createFriendlyAnimal('chicken', 660, 730, 0.9, 0, 0);
  sceneCharacters.appendChild(bird);
  const bird2 = createFriendlyAnimal('chicken', 1260, 730, 0.9, 0, 0);
  sceneCharacters.appendChild(bird2);
}

function renderFarm(t) {
  clearScene();
  const names = ['cow', 'pig', 'chicken', 'duck'];
  names.forEach((type, idx) => {
    const x = 360 + idx * 350;
    const y = 760 + Math.sin(t * 4 + idx) * 10;
    const animal = createFriendlyAnimal(type, x, y, 1.0 + idx * 0.04, 0, 0);
    sceneCharacters.appendChild(animal);
  });

  const barn = document.createElementNS(svgNS, 'g');
  const body = document.createElementNS(svgNS, 'rect');
  body.setAttribute('x', '1310'); body.setAttribute('y', '570'); body.setAttribute('width', '240'); body.setAttribute('height', '200'); body.setAttribute('fill', '#d69157'); body.setAttribute('rx', '20'); body.setAttribute('stroke', '#8c4f1d'); body.setAttribute('stroke-width', '8');
  const roof = document.createElementNS(svgNS, 'polygon');
  roof.setAttribute('points', '1280,570 1450,450 1620,570');
  roof.setAttribute('fill', '#bb5f2d');
  roof.setAttribute('stroke', '#7d3c18');
  roof.setAttribute('stroke-width', '8');
  const door = document.createElementNS(svgNS, 'rect');
  door.setAttribute('x', '1410'); door.setAttribute('y', '650'); door.setAttribute('width', '70'); door.setAttribute('height', '120'); door.setAttribute('fill', '#7a4a24'); door.setAttribute('rx', '10');
  barn.append(body, roof, door);
  sceneCharacters.appendChild(barn);
}

function renderSheep(t) {
  clearScene();
  for (let i = 0; i < 4; i++) {
    const sheep = createFriendlyAnimal('sheep', 360 + i * 350, 760 + Math.sin(t * 5 + i) * 18, 1.1, 0, 0);
    sceneCharacters.appendChild(sheep);
  }
}

function renderSpider(t) {
  clearScene();
  const spider = createFriendlyAnimal('spider', 980, 610 + Math.sin(t * 7) * 12, 1.2, 0, 0);
  sceneCharacters.appendChild(spider);

  const web = document.createElementNS(svgNS, 'path');
  web.setAttribute('d', 'M 720 240 Q 980 180 1240 240');
  web.setAttribute('fill', 'none');
  web.setAttribute('stroke', '#f5e9ff');
  web.setAttribute('stroke-width', '5');
  web.setAttribute('stroke-dasharray', '14 18');
  sceneCharacters.appendChild(web);

  for (let i = 0; i < 8; i++) {
    const line = document.createElementNS(svgNS, 'line');
    const x = 720 + i * 80;
    line.setAttribute('x1', String(x));
    line.setAttribute('y1', '240');
    line.setAttribute('x2', String(980 + i * 12));
    line.setAttribute('y2', '860');
    line.setAttribute('stroke', 'rgba(255,255,255,0.4)');
    line.setAttribute('stroke-width', '2.5');
    sceneCharacters.appendChild(line);
  }
}

function renderHumpty(t) {
  clearScene();
  const wall = document.createElementNS(svgNS, 'rect');
  wall.setAttribute('x', '320'); wall.setAttribute('y', '470'); wall.setAttribute('width', '1280'); wall.setAttribute('height', '170'); wall.setAttribute('rx', '20'); wall.setAttribute('fill', '#f2d3a1'); wall.setAttribute('stroke', '#b8762a'); wall.setAttribute('stroke-width', '6');
  sceneCharacters.appendChild(wall);

  const egg = createFriendlyAnimal('egg', 960, 430 + Math.sin(t * 4) * 10, 1.2, 0, 0);
  sceneCharacters.appendChild(egg);
}

function renderClock(t) {
  clearScene();
  const clock = document.createElementNS(svgNS, 'g');
  const ring = document.createElementNS(svgNS, 'circle');
  ring.setAttribute('cx', '960'); ring.setAttribute('cy', '500'); ring.setAttribute('r', '180'); ring.setAttribute('fill', '#fff9e8'); ring.setAttribute('stroke', '#f5b93d'); ring.setAttribute('stroke-width', '12');
  clock.appendChild(ring);

  for (let i = 0; i < 12; i++) {
    const tick = document.createElementNS(svgNS, 'line');
    const a = (Math.PI / 6) * i - Math.PI / 2;
    const innerX = 960 + Math.cos(a) * 135;
    const innerY = 500 + Math.sin(a) * 135;
    const outerX = 960 + Math.cos(a) * 175;
    const outerY = 500 + Math.sin(a) * 175;
    tick.setAttribute('x1', String(innerX)); tick.setAttribute('y1', String(innerY)); tick.setAttribute('x2', String(outerX)); tick.setAttribute('y2', String(outerY)); tick.setAttribute('stroke', '#7d72c8'); tick.setAttribute('stroke-width', '7');
    clock.appendChild(tick);
  }

  const minuteHand = document.createElementNS(svgNS, 'line');
  minuteHand.setAttribute('x1', '960'); minuteHand.setAttribute('y1', '500'); minuteHand.setAttribute('x2', String(960 + Math.cos(t * 2.5) * 120)); minuteHand.setAttribute('y2', String(500 + Math.sin(t * 2.5) * 120)); minuteHand.setAttribute('stroke', '#7d72c8'); minuteHand.setAttribute('stroke-width', '12'); minuteHand.setAttribute('stroke-linecap', 'round');
  clock.appendChild(minuteHand);

  const hourHand = document.createElementNS(svgNS, 'line');
  hourHand.setAttribute('x1', '960'); hourHand.setAttribute('y1', '500'); hourHand.setAttribute('x2', String(960 + Math.cos((t * 2.5) / 12) * 82)); hourHand.setAttribute('y2', String(500 + Math.sin((t * 2.5) / 12) * 82)); hourHand.setAttribute('stroke', '#fe7d9d'); hourHand.setAttribute('stroke-width', '9'); hourHand.setAttribute('stroke-linecap', 'round');
  clock.appendChild(hourHand);

  const center = document.createElementNS(svgNS, 'circle');
  center.setAttribute('cx', '960'); center.setAttribute('cy', '500'); center.setAttribute('r', '16'); center.setAttribute('fill', '#ff8a7b');
  clock.appendChild(center);

  sceneCharacters.appendChild(clock);

  const mouse = createFriendlyAnimal('mouse', 1110, 720 + Math.sin(t * 5) * 18, 1.0, 0, 0);
  sceneCharacters.appendChild(mouse);
}

function renderSceneByName(name, t) {
  if (name === 'stars') renderStars(t);
  if (name === 'farm') renderFarm(t);
  if (name === 'sheep') renderSheep(t);
  if (name === 'spider') renderSpider(t);
  if (name === 'humpty') renderHumpty(t);
  if (name === 'clock') renderClock(t);
}

function advanceScene(now) {
  const segment = segments[sceneState.index];
  if (!segment) return;

  if (sceneState.timer >= sceneState.segmentDuration) {
    sceneState.index = (sceneState.index + 1) % segments.length;
    sceneState.timer = 0;
    const nextSegment = segments[sceneState.index];
    lyricText.textContent = nextSegment.text;
    mainTitle.textContent = nextSegment.title;
    subtitle.textContent = nextSegment.subtitle;
    setTextColors(nextSegment.palette);
  }

  const current = segments[sceneState.index];
  renderSceneByName(current.scene, sceneState.timer);
  sceneState.timer += 1 / 60;
}

function walk(now) {
  if (!sceneState.lastFrame) sceneState.lastFrame = now;
  const delta = (now - sceneState.lastFrame) / 1000;
  sceneState.lastFrame = now;

  drawBackground();
  advanceScene(now);
  requestAnimationFrame(walk);
}

function start() {
  const firstCell = segments[0];
  lyricText.textContent = firstCell.text;
  mainTitle.textContent = firstCell.title;
  subtitle.textContent = firstCell.subtitle;
  setTextColors(firstCell.palette);
  drawBackground();
  renderSceneByName(firstCell.scene, 0);
  requestAnimationFrame(walk);
}

start();
