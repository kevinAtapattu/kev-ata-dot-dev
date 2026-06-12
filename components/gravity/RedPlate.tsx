"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/hooks/useScrub";

/*
 * A solid 3D IPF-red 25 kg plate, coin-spinning under the hero name.
 * Same zero-dependency approach as the barbell: raw WebGL, with the plate
 * face (rings, hub, "ATAPATTU 25 KG") painted onto a canvas texture and a
 * simple Blinn-Phong light. The one colored object on the page.
 */

const VERT = `
attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aUv;

uniform float uSpin;
uniform float uAspect;

varying vec3 vN;
varying vec2 vUv;

void main() {
  // coin spin around Y
  float c = cos(uSpin); float s = sin(uSpin);
  vec3 p = vec3(c * aPos.x + s * aPos.z, aPos.y, -s * aPos.x + c * aPos.z);
  vec3 n = vec3(c * aNor.x + s * aNor.z, aNor.y, -s * aNor.x + c * aNor.z);

  // fixed tilt so the face reads from the front
  float cx = cos(0.42); float sx = sin(0.42);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  n = vec3(n.x, cx * n.y - sx * n.z, sx * n.y + cx * n.z);

  vN = n;
  vUv = aUv;

  float dist = 3.1 - p.z;
  float f = 2.55;
  // perspective with near=1 far=10 for the depth term
  gl_Position = vec4(p.x * f / uAspect, p.y * f, dist * 1.2222 - 2.2222, dist);
}
`;

const FRAG = `
precision mediump float;

uniform sampler2D uTex;

varying vec3 vN;
varying vec2 vUv;

void main() {
  vec3 n = normalize(vN);
  vec3 l = normalize(vec3(0.35, 0.55, 0.8));
  vec3 base = texture2D(uTex, vUv).rgb;
  float diff = max(dot(n, l), 0.0);
  vec3 col = base * (0.36 + 0.74 * diff);
  vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
  col += vec3(1.0) * pow(max(dot(n, h), 0.0), 26.0) * 0.2;
  gl_FragColor = vec4(col, 1.0);
}
`;

/* Face texture: rim red base, IPF-red disc, grooves, steel hub, branding. */
function paintTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;

  // rim red fills everything outside the face disc (rim UVs sample corners)
  ctx.fillStyle = "#8f161e";
  ctx.fillRect(0, 0, 512, 512);
  // dark texel block for the hub bore surface, sampled at uv (0.97, 0.03)
  ctx.fillStyle = "#101013";
  ctx.fillRect(480, 0, 32, 32);

  const cx = 256;
  const disc = (r: number, fill: string) => {
    ctx.beginPath();
    ctx.arc(cx, cx, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  const ring = (r: number, w: number, stroke: string) => {
    ctx.beginPath();
    ctx.arc(cx, cx, r, 0, Math.PI * 2);
    ctx.lineWidth = w;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  };

  disc(246, "#c2222c"); // face
  ring(238, 7, "#a01820"); // outer groove
  ring(196, 5, "#a91b24"); // inner groove
  disc(64, "#26262b"); // steel hub
  ring(64, 3, "#101013");
  disc(32, "#000"); // bore (cut by geometry, never sampled)

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // brand arc, upper half
  ctx.font = "600 34px Arial";
  const brand = "ATAPATTU";
  const arcR = 150;
  const span = 1.5;
  for (let i = 0; i < brand.length; i++) {
    const a = -Math.PI / 2 - span / 2 + (span * i) / (brand.length - 1);
    ctx.save();
    ctx.translate(cx + Math.cos(a) * arcR, cx + Math.sin(a) * arcR);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(brand[i], 0, 0);
    ctx.restore();
  }

  // weight, lower half
  ctx.font = "900 92px Arial";
  ctx.fillText("25", cx, 396);
  ctx.font = "700 30px Arial";
  ctx.fillText("KG", cx, 456);

  return c;
}

/* Plate mesh: front/back annulus faces, outer rim, hub bore. */
function buildPlate() {
  const SEG = 80;
  const R = 1;
  const RI = 0.13;
  const T = 0.1;
  const FACE_UV = 0.47;

  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  const quad = (a: number, b: number, c: number, d: number) => {
    idx.push(a, b, c, b, d, c);
  };

  // faces: z = +T (front, +z normal) and z = -T (back, -z normal, u mirrored
  // so the texture isn't mirror-imaged when the back shows)
  for (const side of [1, -1]) {
    const start = pos.length / 3;
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const um = side === 1 ? 1 : -1;
      pos.push(R * c, R * s, side * T, RI * c, RI * s, side * T);
      nor.push(0, 0, side, 0, 0, side);
      uv.push(
        0.5 + um * c * FACE_UV, 0.5 + s * FACE_UV,
        0.5 + um * c * FACE_UV * RI, 0.5 + s * FACE_UV * RI
      );
    }
    for (let i = 0; i < SEG; i++) {
      const o = start + i * 2;
      quad(o, o + 2, o + 1, o + 3);
    }
  }

  // outer rim — radial normals, samples the rim-red base of the texture
  let start = pos.length / 3;
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pos.push(R * c, R * s, T, R * c, R * s, -T);
    nor.push(c, s, 0, c, s, 0);
    uv.push(0.015, 0.985, 0.015, 0.985);
  }
  for (let i = 0; i < SEG; i++) {
    const o = start + i * 2;
    quad(o, o + 2, o + 1, o + 3);
  }

  // hub bore — inward normals, dark texel
  start = pos.length / 3;
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pos.push(RI * c, RI * s, T, RI * c, RI * s, -T);
    nor.push(-c, -s, 0, -c, -s, 0);
    uv.push(0.97, 0.03, 0.97, 0.03);
  }
  for (let i = 0; i < SEG; i++) {
    const o = start + i * 2;
    quad(o, o + 2, o + 1, o + 3);
  }

  return {
    pos: new Float32Array(pos),
    nor: new Float32Array(nor),
    uv: new Float32Array(uv),
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

export default function RedPlate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = prefersReducedMotion();

    // scroll progress through the pinned hero — drives the spin
    const hero = canvas.closest(".g-hero") as HTMLElement | null;
    const scrollP = () => {
      if (!hero) return 0;
      const r = hero.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      return travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
    };

    // graceful degrade: a 2D-canvas "coin" renderer with the same
    // scroll-scrubbed spin, for browsers or profiles where WebGL is blocked
    // or draws nothing. The face ellipse, rim hull, and shading are drawn
    // analytically, so it has real thickness at every angle (a CSS-3D card
    // degenerates exactly edge-on). Returns its own cleanup.
    let fbCleanup: (() => void) | null = null;
    const fallback = () => {
      canvas.style.display = "none";
      const c2 = document.createElement("canvas");
      c2.className = "g-hero__plate";
      canvas.insertAdjacentElement("afterend", c2);
      const ctx = c2.getContext("2d");
      if (!ctx) return (fbCleanup = () => c2.remove());

      // face image: the square texture clipped to the plate disc
      const face = document.createElement("canvas");
      face.width = face.height = 512;
      const fctx = face.getContext("2d")!;
      fctx.beginPath();
      fctx.arc(256, 256, 246, 0, Math.PI * 2);
      fctx.clip();
      fctx.drawImage(paintTexture(), 0, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sizeUp = () => {
        c2.width = Math.round(c2.clientWidth * dpr);
        c2.height = Math.round(c2.clientHeight * dpr);
      };
      sizeUp();

      const drawCoin = () => {
        const W = c2.width;
        const H = c2.height;
        const D = Math.min(W, H) * 0.94; // plate diameter
        const T = D * 0.11; // plate thickness
        const th = scrollP() * Math.PI * 4; // two revolutions per scrub
        const sq = Math.max(Math.abs(Math.cos(th)), 0.03); // face squash
        const xo = (T / 2) * Math.sin(th); // face offset from spin axis
        const cx = W / 2;
        const cy = H / 2;

        ctx.clearRect(0, 0, W, H);

        // rim: hull of the two face ellipses (far ellipse + bridge + near)
        ctx.fillStyle = "#7e131b";
        ctx.beginPath();
        ctx.ellipse(cx - xo, cy, (D / 2) * sq, D / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + xo, cy, (D / 2) * sq, D / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - Math.abs(xo), cy - D / 2, Math.abs(xo) * 2, D);

        // near face, squashed to its ellipse
        ctx.save();
        ctx.translate(cx + xo, cy);
        ctx.scale(sq, 1);
        ctx.drawImage(face, -D / 2, -D / 2, D, D);
        ctx.restore();

        // shade the face as it turns away from the viewer
        ctx.save();
        ctx.globalAlpha = (1 - sq) * 0.3;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(cx + xo, cy, (D / 2) * sq, D / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      let fbRaf = 0;
      const onScroll = () => {
        if (!fbRaf) {
          fbRaf = requestAnimationFrame(() => {
            fbRaf = 0;
            drawCoin();
          });
        }
      };
      const onResize = () => {
        sizeUp();
        onScroll();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      drawCoin();
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
    attr("aUv", mesh.uv, 2);

    const ibuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.idx, gl.STATIC_DRAW);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paintTexture());
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uSpin = gl.getUniformLocation(prog, "uSpin");
    const uAspect = gl.getUniformLocation(prog, "uAspect");

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

    const draw = (spin: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uSpin, spin);
      gl.uniform1f(uAspect, canvas.width / Math.max(canvas.height, 1));
      gl.drawElements(gl.TRIANGLES, mesh.idx.length, gl.UNSIGNED_SHORT, 0);
    };

    // the plate is opaque and centered — if the middle rows are still fully
    // transparent after drawing, the context isn't actually rasterizing
    const drewSomething = () => {
      const row = new Uint8Array(canvas.width * 4 * 2);
      gl.readPixels(
        0, Math.floor(canvas.height / 2), canvas.width, 2,
        gl.RGBA, gl.UNSIGNED_BYTE, row
      );
      for (let i = 3; i < row.length; i += 4) if (row[i] > 0) return true;
      return false;
    };

    if (reduced) {
      // no idle motion — just the scroll-scrubbed spin
      const drawScrubbed = () => draw(0.55 + scrollP() * Math.PI * 4);
      drawScrubbed();
      if (!drewSomething()) {
        fallback();
        return () => {
          window.removeEventListener("resize", resize);
          fbCleanup?.();
        };
      }
      let rRaf = 0;
      const onScroll = () => {
        if (!rRaf) {
          rRaf = requestAnimationFrame(() => {
            rRaf = 0;
            drawScrubbed();
          });
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        if (rRaf) cancelAnimationFrame(rRaf);
      };
    }

    let raf = 0;
    let running = true;
    let checked = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      // slow idle drift + two full revolutions across the hero scrub
      draw(((now - t0) / 1000) * 0.25 + scrollP() * Math.PI * 4);
      if (!checked && now - t0 > 900) {
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
      className="g-hero__plate"
      aria-label="Spinning red 25 kilogram competition plate"
      role="img"
    />
  );
}
