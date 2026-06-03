"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { works } from "./works";
import { useStinger } from "./Stinger";

/**
 * 3D works showcase. A fixed rectangular box with a project on each face.
 * Scrolling rotates the box face-by-face (each face = a project); past the
 * last project it shrinks and bursts into particles. Click → open that project.
 * Sticky-based (no ScrollTrigger pin) to avoid React reparent crashes; driven
 * by the GSAP ticker (honours reduced-motion / hidden tabs).
 */
const FACES_END = 0.74; // scroll progress where the rotation ends + burst begins

export default function Works3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const frontIndex = useRef(0);
  const go = useStinger();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const N = works.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // scroll room for the rotation + burst (short + static for reduced motion)
    section.style.height = reduce ? "100vh" : `${(N + 1) * 100}vh`;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(3, 4, 5);
    scene.add(key);

    const edgeColor = () =>
      new THREE.Color(
        getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#16161c"
      );

    // Textures (one per project)
    const loader = new THREE.TextureLoader();
    const projTex = works.map((w) => {
      const t = loader.load(w.image);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });

    // Wide cuboid (elongated along X), projects on the two END faces
    // (+x right, -x left) — the highlighted "Left & Right" faces. Scroll
    // sweeps from the right end → broadside → the left end.
    const W = 7, // length — elongated, stretches across / into the screen
      H = 3.2, // cross-section height
      D = 4.2; // cross-section depth (end caps are D×H — the project faces)
    const edgeMat = () =>
      new THREE.MeshStandardMaterial({ color: edgeColor(), roughness: 0.85, metalness: 0.1, transparent: true });
    const faceMat = (tex: THREE.Texture) =>
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0, transparent: true });
    // BoxGeometry material order: [+x, -x, +y, -y, +z, -z]
    // Projects on the two END CAPS — +x (right) and -x (left). Long faces blank.
    const mats: THREE.MeshStandardMaterial[] = [
      faceMat(projTex[0]), // +x = project 1 (right end cap)
      faceMat(projTex[Math.min(1, N - 1)]), // -x = project 2 (left end cap)
      edgeMat(), // +y
      edgeMat(), // -y
      edgeMat(), // +z
      edgeMat(), // -z
    ];
    const box = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mats);
    scene.add(box);

    // Particle field sampled in the box volume, each with an outward velocity.
    const COUNT = 1500;
    const base = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const work = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * W;
      const y = (Math.random() - 0.5) * H;
      const z = (Math.random() - 0.5) * D;
      base[i * 3] = work[i * 3] = x;
      base[i * 3 + 1] = work[i * 3 + 1] = y;
      base[i * 3 + 2] = work[i * 3 + 2] = z;
      const len = Math.hypot(x, y, z) || 1;
      const sp = 2 + Math.random() * 5;
      vel[i * 3] = (x / len) * sp + (Math.random() - 0.5);
      vel[i * 3 + 1] = (y / len) * sp + (Math.random() - 0.5);
      vel[i * 3 + 2] = (z / len) * sp + (Math.random() - 0.5);
    }
    const pGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(work, 3);
    pGeo.setAttribute("position", posAttr);
    const pMat = new THREE.PointsMaterial({ color: edgeColor(), size: 0.05, transparent: true, opacity: 0 });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    let lastW = 0,
      lastH = 0;
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // pull the camera back on portrait so the box always fits
      camera.position.z = camera.aspect < 1 ? 9 + (1 - camera.aspect) * 6 : 9;
      camera.updateProjectionMatrix();
    };

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: MouseEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onPointer);
    window.addEventListener("resize", resize);

    const progress = () => {
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
    };

    const render = () => {
      resize();
      const p = reduce ? 0 : progress();
      const facesP = Math.min(1, p / FACES_END);
      const burst = Math.max(0, Math.min(1, (p - FACES_END) / (1 - FACES_END)));

      // sweep: right end cap (-90°) → broadside (0°) → left end cap (+90°)
      box.rotation.y = -Math.PI / 2 + facesP * Math.PI + pointer.x * 0.25;
      box.rotation.x = -0.12 + pointer.y * 0.15;

      const idx = Math.round(facesP * (N - 1));
      if (idx !== frontIndex.current) {
        frontIndex.current = idx;
        if (nameRef.current) nameRef.current.textContent = works[idx].name;
        if (counterRef.current)
          counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      }

      box.scale.setScalar(1 - burst * 0.6);
      mats.forEach((m) => (m.opacity = 1 - burst));
      box.visible = burst < 1;
      pMat.opacity = burst > 0 ? Math.sin(Math.min(burst, 1) * Math.PI) * 0.9 : 0;
      if (burst > 0) {
        for (let i = 0; i < COUNT * 3; i++) work[i] = base[i] + vel[i] * burst;
        posAttr.needsUpdate = true;
        points.rotation.copy(box.rotation);
      }
      if (endRef.current) endRef.current.style.opacity = String(Math.max(0, (burst - 0.5) * 2));

      renderer.render(scene, camera);
    };

    if (reduce) render();
    else gsap.ticker.add(render);

    const obs = new MutationObserver(() => {
      const c = edgeColor();
      mats.forEach((m, i) => {
        if (i < 4) m.color = c;
      });
      pMat.color = c;
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onClick = () => go(`/work/${works[frontIndex.current].slug}`);
    canvas.addEventListener("click", onClick);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("mousemove", onPointer);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onClick);
      obs.disconnect();
      box.geometry.dispose();
      mats.forEach((m) => m.dispose());
      pGeo.dispose();
      pMat.dispose();
      projTex.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [go]);

  return (
    <section id="work" className="works3d" ref={sectionRef}>
      <div className="works3d-sticky">
        <div className="work-rail-head">
          <div className="spine-label">04 — Selected Work</div>
          <div className="label">Scroll — every face is a project</div>
        </div>
        <canvas ref={canvasRef} className="works3d-canvas" data-hover data-cursor="View ↗" />
        <div className="works3d-ui">
          <div className="works3d-counter" ref={counterRef}>
            01 / {String(works.length).padStart(2, "0")}
          </div>
          <div className="works3d-name" ref={nameRef}>
            {works[0].name}
          </div>
          <div className="works3d-hint">Click to view project →</div>
        </div>
        <div className="works3d-end" ref={endRef}>
          That&apos;s the work — let&apos;s build yours.
        </div>
      </div>
    </section>
  );
}
