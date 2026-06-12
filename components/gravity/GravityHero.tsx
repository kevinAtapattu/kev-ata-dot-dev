"use client";

import { useEffect, useRef } from "react";
import { useScrub, prefersReducedMotion } from "../../lib/hooks/useScrub";
import RedPlate from "./RedPlate";

/*
 * Raw WebGL particle scene — no three.js. ~6k particles fall under gravity
 * and assemble into a rotating barbell. The cursor displaces them in screen
 * space; scrolling the pinned hero pushes the camera through the bar and
 * shears the particles apart.
 */

const VERT = `
attribute vec3 aStart;
attribute vec3 aTarget;
attribute vec4 aSeed; // x: stagger delay, y: brightness, z: explode factor, w: size variance

uniform float uTime;
uniform float uAssemble;
uniform float uScroll;
uniform float uAspect;
uniform float uHeight;
uniform float uDpr;
uniform vec2  uMouse;
uniform float uMouseOn;

varying float vAlpha;

void main() {
  // staggered gravity drop into place
  float t = clamp((uAssemble - aSeed.x * 0.55) / 0.45, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 4.0);
  vec3 p = mix(aStart, aTarget, e);

  // idle breathing
  p += 0.014 * e * vec3(
    sin(uTime * 0.8 + aSeed.y * 43.0),
    cos(uTime * 0.7 + aSeed.z * 37.0),
    sin(uTime * 0.9 + aSeed.w * 53.0)
  );

  // scroll shears the bar apart, radially from its axis
  float ex = pow(uScroll, 1.6) * (0.5 + aSeed.z * 2.6);
  p += normalize(aTarget + vec3(0.0001, 0.0002, 0.0001)) * ex * 2.4;

  // near side-on with a slow sway, spun by scroll
  float ang = sin(uTime * 0.3) * 0.22 + uScroll * 2.6;
  float c = cos(ang); float s = sin(ang);
  p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);

  // fixed tilt
  float cx = cos(-0.16); float sx = sin(-0.16);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);

  // camera pushes through the scene with scroll
  float camZ = 6.4 - uScroll * 4.8;
  float dist = camZ - p.z;
  float f = 2.2; // ~49deg fov
  vec4 clip = vec4(p.x * f / uAspect, p.y * f, 0.0, dist);

  // cursor repulsion in NDC space
  if (uMouseOn > 0.001 && dist > 0.1) {
    vec2 ndc = clip.xy / dist;
    vec2 dm = ndc - uMouse;
    float md = length(dm * vec2(uAspect, 1.0));
    float push = (1.0 - smoothstep(0.0, 0.5, md)) * 0.22 * uMouseOn * e;
    clip.xy += normalize(dm + vec2(0.0001)) * push * dist;
  }

  gl_Position = clip;

  float ps = uHeight * uDpr * 0.02 * (0.55 + aSeed.w) / max(dist, 0.4);
  gl_PointSize = clamp(ps, 1.25 * uDpr, 9.0 * uDpr);

  float fade = 1.0 - smoothstep(0.8, 0.99, uScroll);
  vAlpha = (0.3 + 0.7 * aSeed.y) * e * fade;
}
`;

const FRAG = `
precision mediump float;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = (1.0 - smoothstep(0.1, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(vec3(a), 1.0); // additive
}
`;

function buildParticles(count: number) {
  const starts = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);

  const PLATE_X = [1.52, 1.66, 1.79];
  const PLATE_R = [0.95, 0.7, 0.48];
  const PLATE_T = 0.055;
  const HUB = 0.075;
  // plate pick probability ~ area
  const areas = PLATE_R.map((r) => r * r);
  const areaSum = areas[0] + areas[1] + areas[2];

  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    const kind = Math.random();

    if (kind < 0.3) {
      // bar + sleeves
      x = (Math.random() * 2 - 1) * 2.35;
      const rad = Math.abs(x) > 1.42 ? 0.06 : 0.036;
      const a = Math.random() * Math.PI * 2;
      y = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
    } else {
      // plates
      const side = Math.random() < 0.5 ? -1 : 1;
      let pick = Math.random() * areaSum;
      let pi = 0;
      if (pick > areas[0]) pi = 1;
      if (pick > areas[0] + areas[1]) pi = 2;
      const R = PLATE_R[pi];

      if (Math.random() < 0.82) {
        // disc faces
        const rad = Math.sqrt(Math.random() * (R * R - HUB * HUB) + HUB * HUB);
        const a = Math.random() * Math.PI * 2;
        y = Math.cos(a) * rad;
        z = Math.sin(a) * rad;
        x = side * (PLATE_X[pi] + (Math.random() < 0.5 ? -1 : 1) * PLATE_T);
      } else {
        // rim
        const a = Math.random() * Math.PI * 2;
        y = Math.cos(a) * R;
        z = Math.sin(a) * R;
        x = side * (PLATE_X[pi] + (Math.random() * 2 - 1) * PLATE_T);
      }
    }

    targets[i * 3] = x;
    targets[i * 3 + 1] = y;
    targets[i * 3 + 2] = z;

    // scattered above the scene — they fall in
    starts[i * 3] = (Math.random() * 2 - 1) * 7;
    starts[i * 3 + 1] = 3 + Math.random() * 7;
    starts[i * 3 + 2] = (Math.random() * 2 - 1) * 4;

    seeds[i * 4] = Math.random();
    seeds[i * 4 + 1] = Math.random();
    seeds[i * 4 + 2] = Math.random();
    seeds[i * 4 + 3] = Math.random();
  }

  return { starts, targets, seeds };
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function GravityHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  useScrub(sectionRef, (p) => {
    scrollRef.current = p;
    const copy = copyRef.current;
    if (copy) {
      const fade = Math.max(0, 1 - p * 1.9);
      copy.style.opacity = String(fade);
      copy.style.transform = `translate3d(0, ${-p * 18}vh, 0)`;
    }
    const cue = cueRef.current;
    if (cue) cue.style.opacity = String(Math.max(0, 1 - p * 6));
  }, "pinned");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = prefersReducedMotion();

    // graceful degrade: dot-matrix field behind the name when WebGL is
    // blocked or silently draws nothing
    const fallback = () => {
      canvas.closest(".g-hero__pin")?.classList.add("g-hero__pin--nogl");
    };

    if (window.location.search.includes("nogl")) {
      fallback();
      return;
    }

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true
      }) || canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGLRenderingContext)) return fallback();

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return fallback();
    const prog = gl.createProgram();
    if (!prog) return fallback();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fallback();
    gl.useProgram(prog);

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 3000 : 6500;
    const { starts, targets, seeds } = buildParticles(COUNT);

    const bind = (name: string, data: Float32Array, size: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind("aStart", starts, 3);
    bind("aTarget", targets, 3);
    bind("aSeed", seeds, 4);

    const U = (name: string) => gl.getUniformLocation(prog, name);
    const uTime = U("uTime");
    const uAssemble = U("uAssemble");
    const uScroll = U("uScroll");
    const uAspect = U("uAspect");
    const uHeight = U("uHeight");
    const uDpr = U("uDpr");
    const uMouse = U("uMouse");
    const uMouseOn = U("uMouseOn");

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // smoothed mouse state
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.ton = 1;
    };
    const onLeave = () => {
      mouse.ton = 0;
    };
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    let raf = 0;
    let running = true;
    let checked = false;
    const t0 = performance.now();

    // assembled barbell spans the middle of the canvas — if the center rows
    // are still fully transparent after assembly, nothing is rasterizing
    const drewSomething = () => {
      const rows = new Uint8Array(canvas.width * 4 * 2);
      gl.readPixels(
        0, Math.floor(canvas.height / 2), canvas.width, 2,
        gl.RGBA, gl.UNSIGNED_BYTE, rows
      );
      for (let i = 0; i < rows.length; i += 4) {
        if (rows[i] + rows[i + 1] + rows[i + 2] > 0) return true;
      }
      return false;
    };

    const frame = (now: number) => {
      if (!running) return;
      const t = (now - t0) / 1000;
      const assemble = reduced ? 1 : Math.min(1, t / 2.6);

      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.on += (mouse.ton - mouse.on) * 0.06;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, reduced ? 0 : t);
      gl.uniform1f(uAssemble, assemble);
      gl.uniform1f(uScroll, reduced ? 0 : scrollRef.current);
      gl.uniform1f(uAspect, canvas.width / Math.max(canvas.height, 1));
      gl.uniform1f(uHeight, canvas.clientHeight);
      gl.uniform1f(uDpr, dpr);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      // run the check once, after assembly, while the bar is on screen
      if (!checked && t > 3.5 && scrollRef.current < 0.5) {
        checked = true;
        if (!drewSomething()) {
          running = false;
          fallback();
          return;
        }
      }

      raf = requestAnimationFrame(frame);
    };

    // only render while the hero is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      // note: never loseContext() here — a canvas keeps its context across
      // remounts (React StrictMode), and a lost context can't be reacquired
    };
  }, []);

  return (
    <section ref={sectionRef} className="g-hero" id="top">
      <div className="g-hero__pin">
        <canvas ref={canvasRef} className="g-hero__canvas" aria-hidden="true" />

        <div ref={copyRef} className="g-hero__copy">
          <div className="g-mono g-hero__eyebrow">
            Engineer · Powerlifter · Climber · Founder at 15
          </div>
          <h1 className="g-display g-hero__title">
            Kevin
            <br />
            <em>Atapattu</em>
          </h1>
          <RedPlate />
          <p className="g-hero__sub">
            I move heavy things — code, iron, and myself up walls.
          </p>
        </div>

        <div ref={cueRef} className="g-hero__cue">
          <span>Scroll to load</span>
          <div className="g-hero__cue-line" />
        </div>
      </div>
    </section>
  );
}
