"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { gsap } from "gsap";
import { prefersReducedMotion } from "./motion";

/**
 * Ambient 3D background. A slowly rotating wireframe icosahedron wrapped in a
 * drifting particle field. Rotation tracks scroll; the whole rig parallaxes
 * subtly with the cursor. Colour is read from the live --accent CSS variable
 * and re-synced whenever the theme changes. Driven by the GSAP ticker so it
 * stays in lock-step with Lenis and honours reduced-motion / hidden tabs.
 */
export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  // Calm the 3D right down on sub-pages (legal, case studies) so their content
  // reads as a clean document instead of text floating over a starfield.
  const isSub = pathname !== "/";

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL — fail silent, the CSS bg still looks good
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const readAccent = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      return new THREE.Color(v || "#c8873a");
    };
    let color = readAccent();

    const group = new THREE.Group();
    scene.add(group);

    // Wireframe icosahedron
    // Simple → complex polygon set; the shape morphs as you scroll through sections.
    const baseGeos: THREE.BufferGeometry[] = [
      new THREE.TetrahedronGeometry(2.9, 0),
      new THREE.OctahedronGeometry(2.8, 0),
      new THREE.BoxGeometry(3.4, 3.4, 3.4),
      new THREE.IcosahedronGeometry(2.7, 0),
      new THREE.DodecahedronGeometry(2.7, 0),
      new THREE.IcosahedronGeometry(2.7, 1),
      new THREE.IcosahedronGeometry(2.6, 2),
    ];
    const wireGeos = baseGeos.map((g) => new THREE.WireframeGeometry(g));
    const wire = new THREE.LineSegments(
      wireGeos[0],
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
    );
    let band = 0;
    let swap = 1;
    group.add(wire);

    // Particle field
    const COUNT = 700;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color, size: 0.035, transparent: true, opacity: 0.6 })
    );
    group.add(points);

    // Resize
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // Pointer parallax
    const pointer = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // Theme change → recolour
    const obs = new MutationObserver(() => {
      color = readAccent();
      (wire.material as THREE.LineBasicMaterial).color = color;
      (points.material as THREE.PointsMaterial).color = color;
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const render = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      // Morph shape with scroll: simple polygon → complex.
      const b = Math.max(0, Math.min(wireGeos.length - 1, Math.floor(progress * wireGeos.length)));
      if (b !== band) {
        band = b;
        wire.geometry = wireGeos[b];
        swap = 0.7; // little pop on each shape change
      }
      swap += (1 - swap) * 0.08;
      wire.scale.setScalar(swap);
      group.rotation.y = progress * Math.PI * 2.2;
      group.rotation.x = progress * Math.PI * 0.8;
      points.rotation.y -= 0.0006;
      // ease camera toward pointer
      camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    if (reduce) {
      render(); // single static frame
    } else {
      gsap.ticker.add(render);
    }

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      obs.disconnect();
      baseGeos.forEach((g) => g.dispose());
      wireGeos.forEach((g) => g.dispose());
      pGeo.dispose();
      (wire.material as THREE.Material).dispose();
      (points.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="three-bg"
      aria-hidden
      style={isSub ? { opacity: 0.05 } : undefined}
    />
  );
}
