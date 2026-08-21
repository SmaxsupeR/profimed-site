// Чистая обёртка над Matter.js — вынесена из React-компонента, чтобы start()
// оставался переиспользуемым сам по себе (например, для будущей кнопки
// «повторить») и не был завязан на жизненный цикл конкретного компонента.
// Matter передаётся параметром, а не импортируется здесь напрямую — модуль
// грузится динамически (см. PhysicsJar.jsx), только когда банка реально
// попадает в область видимости.

// Представительное количество физических тел, не буквальный счётчик
// пациентов — реальное число (см. PATIENTS_TOTAL ниже) показывается
// отдельным текстом рядом (JarStats.jsx, Splash.jsx), больше падающих
// очков только замедлит браузер.
export const GLASS_COUNT = 46;
export const DEFAULT_SPAWN_INTERVAL_MS = 90;

// Настоящая цифра пациентов — общая для банки в статистике и в приветствии,
// чтобы обе анимации показывали одно и то же число.
export const PATIENTS_TOTAL = 3240;

// Система координат отрисовки — не привязана к CSS-размеру канваса на
// странице (тот растягивается через width:100%), а откалибрована под
// плотность/трение/радиусы тел ниже.
export const GEO = { W: 400, H: 460, L: 108, R: 292, TOP: 108, BOT: 340, CX: 200 };

function wall(Matter, x1, y1, x2, y2) {
  const { Bodies } = Matter;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  return Bodies.rectangle((x1 + x2) / 2, (y1 + y2) / 2, len, 14, { isStatic: true, angle, friction: 0.5 });
}

function makeGlasses(Matter, x, y) {
  const { Bodies, Body } = Matter;
  const left = Bodies.circle(x - 9, y, 6.5, { friction: 0.08 });
  const right = Bodies.circle(x + 9, y, 6.5, { friction: 0.08 });
  const bridge = Bodies.rectangle(x, y, 7, 3, { friction: 0.08 });
  const g = Body.create({ parts: [left, right, bridge], restitution: 0.3, friction: 0.08, frictionAir: 0.001, density: 0.0018 });
  Body.setAngularVelocity(g, (Math.random() - 0.5) * 0.25);
  return g;
}

function drawGlasses(ctx, colors, g) {
  ctx.save();
  ctx.translate(g.position.x, g.position.y);
  ctx.rotate(g.angle);
  ctx.strokeStyle = colors.glass;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(-9, 0, 6.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(9, 0, 6.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-2.5, 0); ctx.lineTo(2.5, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-15.5, 0); ctx.lineTo(-21, -2.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(15.5, 0); ctx.lineTo(21, -2.5); ctx.stroke();
  ctx.restore();
}

function drawJar(ctx, colors) {
  const { L, R, TOP, BOT, CX } = GEO;
  ctx.strokeStyle = colors.jar;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(L, TOP);
  ctx.lineTo(L, BOT - 10);
  ctx.quadraticCurveTo(L, BOT + 8, L + 34, BOT + 8);
  ctx.lineTo(R - 34, BOT + 8);
  ctx.quadraticCurveTo(R, BOT + 8, R, BOT - 10);
  ctx.lineTo(R, TOP);
  ctx.stroke();
  // Горлышко в перспективе — эллипс сверху...
  ctx.beginPath();
  ctx.ellipse(CX, TOP, (R - L) / 2, 13, 0, 0, Math.PI * 2);
  ctx.stroke();
  // ...и второй, тоньше и бледнее — толщина стекла у края.
  ctx.strokeStyle = colors.jarFaint;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(CX, TOP + 7, (R - L) / 2 - 7, 9, 0, 0, Math.PI * 2);
  ctx.stroke();
}

// `colors` — мутируемый объект ({jar, jarFaint, glass}), а не примитивы:
// draw() читает его свойства на каждом кадре, поэтому переключение
// светлой/тёмной темы на лету подхватывается без пересоздания симуляции.
export function createGlassesSim(Matter, canvas, colors, spawnIntervalMs = DEFAULT_SPAWN_INTERVAL_MS) {
  const { Engine, World, Bodies, Runner } = Matter;
  const ctx = canvas.getContext('2d');
  const { L, R, TOP, BOT, CX, W, H } = GEO;
  let engine, runner, bodies = [], spawnTimer, spawned = 0, rafId = null, running = false;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawJar(ctx, colors);
    bodies.forEach((g) => drawGlasses(ctx, colors, g));
    if (running) rafId = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    clearInterval(spawnTimer);
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    if (runner) Runner.stop(runner);
    if (engine) { World.clear(engine.world, false); Engine.clear(engine); }
    bodies = [];
    spawned = 0;
  }

  function start() {
    stop();
    running = true;
    engine = Engine.create();
    engine.gravity.y = 1;
    const floor = Bodies.rectangle(CX, BOT + 12, R - L - 8, 16, { isStatic: true, friction: 0.5 });
    World.add(engine.world, [wall(Matter, L, TOP, L, BOT - 8), wall(Matter, R, TOP, R, BOT - 8), floor]);
    runner = Runner.create();
    Runner.run(runner, engine);
    spawnTimer = setInterval(() => {
      if (spawned >= GLASS_COUNT) { clearInterval(spawnTimer); return; }
      const g = makeGlasses(Matter, CX - 50 + Math.random() * 100, 20);
      World.add(engine.world, g);
      bodies.push(g);
      spawned++;
    }, spawnIntervalMs);
    rafId = requestAnimationFrame(draw);
  }

  return { start, stop };
}
