"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/hooks/useScrub";

/*
 * Plates stacking under gravity beside the manifesto. Each plate's drop is
 * scrubbed by scroll (accelerating fall, reversible), the stack idles in a
 * slow rotation, and the last plate to land on top is the red 25. Raw WebGL
 * lit mesh, with a 2D side-view fallback when WebGL draws nothing.
 */

const VERT = `
attribute vec3 aPos;
attribute vec3 aNor;

uniform float uAng;
uniform float uY;
uniform float uFlat;
uniform float uAspect;

varying vec3 vN;

void main() {
  vec3 p = aPos;
  p.y *= uFlat;

  float c = cos(uAng); float s = sin(uAng);
  p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  vec3 n = vec3(c * aNor.x + s * aNor.z, aNor.y, -s * aNor.x + c * aNor.z);

  p.y += uY;

  // camera tilt, looking slightly down at the stack
  float cx = cos(0.4); float sx = sin(0.4);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  n = vec3(n.x, cx * n.y - sx * n.z, sx * n.y + cx * n.z);

  vN = n;

  float dist = 4.6 - p.z;
  float f = 2.1;
  gl_Position = vec4(p.x * f / uAspect, p.y * f, dist * 1.2222 - 2.2222, dist);
}
`;

const FRAG = `
precision mediump float;

uniform vec3 uColor;

varying vec3 vN;

void main() {
  vec3 n = normalize(vN);
  vec3 l = normalize(vec3(0.35, 0.65, 0.6));
  float diff = max(dot(n, l), 0.0);
  vec3 col = uColor * (0.35 + 0.8 * diff);
  vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
  col += vec3(1.0) * pow(max(dot(n, h), 0.0), 30.0) * 0.12;
  gl_FragColor = vec4(col, 1.0);
}
`;

const HALF_T = 0.115; // plate half-thickness
const FLOOR = -1.0;
// alternating greys so the seams read, red 25 lands last on top
const COLORS = ["#1b1b1f", "#37373d", "#1e1e23", "#3b3b41", "#222227", "#c2222c"];
const N = COLORS.length;
const DROP_FROM = 2.6;

// small air gap between plates so each one reads as its own object
const targetY = (i: number) => FLOOR + HALF_T + i * (2 * HALF_T + 0.045);

// per-plate drop progress from section scroll progress — staggered,
// gravity-eased (accelerating)
const dropP = (p: number, i: number) =>
  Math.min(1, Math.max(0, (p - 0.18 - i * 0.05) / 0.07));

function hex(c: string): [number, number, number] {
  return [
    parseInt(c.slice(1, 3), 16) / 255,
    parseInt(c.slice(3, 5), 16) / 255,
    parseInt(c.slice(5, 7), 16) / 255
  ];
}

/* Plate mesh with its axis along Y: top/bottom annulus faces, outer rim,
   hub bore. */
function buildPlate() {
  const SEG = 64;
  const R = 1;
  const RI = 0.11;

  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];

  const quad = (a: number, b: number, c: number, d: number) => {
    idx.push(a, b, c, b, d, c);
  };

  for (const side of [1, -1]) {
    const start = pos.length / 3;
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      pos.push(R * c, side * HALF_T, R * s, RI * c, side * HALF_T, RI * s);
      nor.push(0, side, 0, 0, side, 0);
    }
    for (let i = 0; i < SEG; i++) {
      const o = start + i * 2;
      quad(o, o + 2, o + 1, o + 3);
    }
  }

  let start = pos.length / 3;
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pos.push(R * c, HALF_T, R * s, R * c, -HALF_T, R * s);
    nor.push(c, 0, s, c, 0, s);
  }
  for (let i = 0; i < SEG; i++) {
    const o = start + i * 2;
    quad(o, o + 2, o + 1, o + 3);
  }

  start = pos.length / 3;
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pos.push(RI * c, HALF_T, RI * s, RI * c, -HALF_T, RI * s);
    nor.push(-c, 0, -s, -c, 0, -s);
  }
  for (let i = 0; i < SEG; i++) {
    const o = start + i * 2;
    quad(o, o + 2, o + 1, o + 3);
  }

  return {
    pos: new Float32Array(pos),
    nor: new Float32Array(nor),
    idx: new Uint16Array(idx)
  };
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

export default function PlateStack() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = prefersReducedMotion();

    const section = canvas.closest(".g-manifesto") as HTMLElement | null;
    const scrollP = () => {
      if (!section) return 1;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };

    // 2D side-view fallback: rounded-bar plates dropping onto a ground line
    let fbCleanup: (() => void) | null = null;
    const fallback = () => {
      canvas.style.display = "none";
      const c2 = document.createElement("canvas");
      c2.className = canvas.className;
      canvas.insertAdjacentElement("afterend", c2);
      const ctx = c2.getContext("2d");
      if (!ctx) return (fbCleanup = () => c2.remove());

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sizeUp = () => {
        c2.width = Math.round(c2.clientWidth * dpr);
        c2.height = Math.round(c2.clientHeight * dpr);
      };
      sizeUp();

      const bar = (x: number, y: number, w: number, h: number) => {
        const r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(x + r, y + h);
        ctx.arc(x + r, y + r, r, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.closePath();
        ctx.fill();
      };

      const draw2d = () => {
        const W = c2.width;
        const H = c2.height;
        const p = scrollP();
        const pw = W * 0.6;
        const ph = H * 0.072;
        const floor = H * 0.86;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#222226";
        ctx.fillRect(W / 2 - pw * 0.72, floor + ph + 2 * dpr, pw * 1.44, 2 * dpr);
        for (let i = 0; i < N; i++) {
          const pi = dropP(p, i);
          if (pi <= 0) continue;
          const e = pi * pi;
          const ty = floor - i * ph * 1.06;
          const y = -ph + (ty + ph) * e;
          ctx.fillStyle = i === N - 1 ? "#c2222c" : COLORS[i];
          bar(W / 2 - pw / 2, y, pw, ph);
        }
      };

      let fbRaf = 0;
      const onScroll = () => {
        if (!fbRaf) {
          fbRaf = requestAnimationFrame(() => {
            fbRaf = 0;
            draw2d();
          });
        }
      };
      const onResize = () => {
        sizeUp();
        onScroll();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      draw2d();
      fbCleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        if (fbRaf) cancelAnimationFrame(fbRaf);
        c2.remove();
        canvas.style.display = "";
      };
      return fbCleanup;
    };

    if (window.location.search.includes("nogl")) {
      return fallback();
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    if (!gl) return fallback();

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

    const mesh = buildPlate();
    const attr = (name: string, data: Float32Array, size: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attr("aPos", mesh.pos, 3);
    attr("aNor", mesh.nor, 3);
    const ibuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.idx, gl.STATIC_DRAW);

    const uAng = gl.getUniformLocation(prog, "uAng");
    const uY = gl.getUniformLocation(prog, "uY");
    const uFlat = gl.getUniformLocation(prog, "uFlat");
    const uAspect = gl.getUniformLocation(prog, "uAspect");
    const uColor = gl.getUniformLocation(prog, "uColor");

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = COLORS.map(hex);

    const draw = (ang: number, p: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uAspect, canvas.width / Math.max(canvas.height, 1));
      gl.uniform1f(uAng, ang);

      // contact shadow: a flattened near-black plate at the floor
      gl.uniform1f(uFlat, 0.04);
      gl.uniform1f(uY, FLOOR + 0.005);
      gl.uniform3f(uColor, 0.045, 0.045, 0.05);
      gl.drawElements(gl.TRIANGLES, mesh.idx.length, gl.UNSIGNED_SHORT, 0);

      gl.uniform1f(uFlat, 1);
      for (let i = 0; i < N; i++) {
        const pi = dropP(p, i);
        if (pi <= 0) continue;
        const e = pi * pi; // gravity: accelerating fall
        gl.uniform1f(uY, DROP_FROM + (targetY(i) - DROP_FROM) * e);
        const [r, g, b] = colors[i];
        gl.uniform3f(uColor, r, g, b);
        gl.drawElements(gl.TRIANGLES, mesh.idx.length, gl.UNSIGNED_SHORT, 0);
      }
    };

    const drewSomething = () => {
      const rows = new Uint8Array(canvas.width * 4 * 2);
      gl.readPixels(
        0, Math.floor(canvas.height / 2), canvas.width, 2,
        gl.RGBA, gl.UNSIGNED_BYTE, rows
      );
      for (let i = 3; i < rows.length; i += 4) if (rows[i] > 0) return true;
      return false;
    };

    let raf = 0;
    let running = true;
    let checked = false;
    const t0 = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      const p = scrollP();
      const idle = reduced ? 0 : ((now - t0) / 1000) * 0.25;
      draw(idle + p * 1.4 + 0.4, p);
      // verify rasterization once the stack has plates on screen
      if (!checked && p > 0.4) {
        checked = true;
        if (!drewSomething()) {
          running = false;
          fallback();
          return;
        }
      }
      raf = requestAnimationFrame(frame);
    };

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
      fbCleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="g-manifesto__stack"
      aria-label="Weight plates stacking up as you scroll, topped by a red 25 kilogram plate"
      role="img"
    />
  );
}
