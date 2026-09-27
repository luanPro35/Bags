"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection({ onInspect }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);

  const [activeColorway, setActiveColorway] = useState("noir");

  // Interaction refs (avoid React re-renders on 60fps frame loops)
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  // Initial angle: Front 3/4 perspective to showcase the 24K gold lock and quilted flap
  const targetDragRot = useRef({ x: 0.04, y: 0.12 });
  const currentDragRot = useRef({ x: 0.04, y: 0.12 });
  const targetMouseTilt = useRef({ x: 0, y: 0 });
  const currentMouseTilt = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  const leatherMaterialsRef = useRef([]);
  const goldMaterialsRef = useRef([]);
  const textureSetsRef = useRef({});

  const colorways = [
    { id: "noir", name: "NOIR 01", base: "#111113", stitch: "#C5A059", stud: "#E8C872", gold: "#F5D061" },
    { id: "eclat", name: "ÉCLAT 02", base: "#D6CCC0", stitch: "#B89B72", stud: "#DFC282", gold: "#EAD4A0" },
    { id: "rose", name: "ROSE 03", base: "#9E6464", stitch: "#D8A8A8", stud: "#F0C8B8", gold: "#E8BCA8" },
  ];

  const handleColorwayChange = (id) => {
    setActiveColorway(id);
    const chosen = colorways.find((c) => c.id === id);
    const texSet = textureSetsRef.current[id];
    if (!chosen) return;

    leatherMaterialsRef.current.forEach((mat) => {
      if (mat) {
        if (texSet) {
          mat.map = texSet.diffuseMap;
          mat.bumpMap = texSet.bumpMap;
          mat.needsUpdate = true;
        }
      }
    });

    goldMaterialsRef.current.forEach((mat) => {
      if (mat && mat.color) {
        gsap.to(mat.color, {
          r: new THREE.Color(chosen.gold).r,
          g: new THREE.Color(chosen.gold).g,
          b: new THREE.Color(chosen.gold).b,
          duration: 0.65,
          ease: "power2.out",
        });
      }
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.12, 3.25);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- PROCEDURAL QUILTED MATELASSÉ LEATHER GENERATOR ---
    const createQuiltedTextureSet = (baseColor, stitchColor, studColor) => {
      const size = 1024;
      const cvs = document.createElement("canvas");
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext("2d");

      // 1. Base pebble leather grain
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, size, size);

      const imgData = ctx.getImageData(0, 0, size, size);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 16;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      // 2. Diamond Pillowed Cushions (Cannage / Matelassé)
      const step = 64;
      for (let y = -step; y < size + step; y += step) {
        for (let x = -step; x < size + step; x += step) {
          const cx = x + step / 2;
          const cy = y + step / 2;
          const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, step * 0.72);
          radGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)"); // Puffy pillow center highlight
          radGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.06)");
          radGrad.addColorStop(0.82, "rgba(0, 0, 0, 0.18)");
          radGrad.addColorStop(1, "rgba(0, 0, 0, 0.48)"); // Deep crease shadow

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = radGrad;
          ctx.fillRect(-step * 0.48, -step * 0.48, step * 0.96, step * 0.96);
          ctx.restore();
        }
      }

      // 3. Diamond Stitch Lines with fine dashed Hermès-style saddle-stitch
      // Pass A: Crease drop shadow
      ctx.lineWidth = 3.4;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
      ctx.setLineDash([]);
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i, size);
        ctx.lineTo(i + size, 0);
        ctx.stroke();
      }

      // Pass B: Golden thread stitches
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = stitchColor;
      ctx.setLineDash([5, 3]);

      // Diagonal 1
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }

      // Diagonal 2
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, size);
        ctx.lineTo(i + size, 0);
        ctx.stroke();
      }

      // 4. Gold Micro-Studs at intersections
      ctx.setLineDash([]);
      for (let y = 0; y <= size; y += step) {
        for (let x = 0; x <= size; x += step) {
          // Shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
          ctx.beginPath();
          ctx.arc(x + 1, y + 1, 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Golden dome
          ctx.fillStyle = studColor;
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Highlight
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(x - 0.7, y - 0.7, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const diffuseMap = new THREE.CanvasTexture(cvs);
      diffuseMap.wrapS = THREE.RepeatWrapping;
      diffuseMap.wrapT = THREE.RepeatWrapping;
      diffuseMap.repeat.set(1.6, 1.6);

      // Bump Map for real 3D depth
      const bcvs = document.createElement("canvas");
      bcvs.width = 512;
      bcvs.height = 512;
      const bctx = bcvs.getContext("2d");
      bctx.fillStyle = "#808080";
      bctx.fillRect(0, 0, 512, 512);

      const bstep = 32;
      for (let y = -bstep; y < 512 + bstep; y += bstep) {
        for (let x = -bstep; x < 512 + bstep; x += bstep) {
          const cx = x + bstep / 2;
          const cy = y + bstep / 2;
          const bGrad = bctx.createRadialGradient(cx, cy, 0, cx, cy, bstep * 0.7);
          bGrad.addColorStop(0, "#FFFFFF"); // raised diamond pillow
          bGrad.addColorStop(0.65, "#888888");
          bGrad.addColorStop(1, "#151515"); // deep recessed stitch groove

          bctx.save();
          bctx.translate(cx, cy);
          bctx.rotate(Math.PI / 4);
          bctx.fillStyle = bGrad;
          bctx.fillRect(-bstep * 0.48, -bstep * 0.48, bstep * 0.96, bstep * 0.96);
          bctx.restore();
        }
      }

      const bumpMap = new THREE.CanvasTexture(bcvs);
      bumpMap.wrapS = THREE.RepeatWrapping;
      bumpMap.wrapT = THREE.RepeatWrapping;
      bumpMap.repeat.set(1.6, 1.6);

      return { diffuseMap, bumpMap };
    };

    // Pre-create textures for all 3 colorways
    textureSetsRef.current = {
      noir: createQuiltedTextureSet("#111113", "#C5A059", "#E8C872"),
      eclat: createQuiltedTextureSet("#D6CCC0", "#B89B72", "#DFC282"),
      rose: createQuiltedTextureSet("#9E6464", "#D8A8A8", "#F0C8B8"),
    };

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.5);
    scene.add(ambientLight);

    // Key Light (top-right-front)
    const keyLight = new THREE.DirectionalLight(0xfffaee, 4.0);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Luxury Golden Rim Light (back-left)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 3.5);
    rimLight.position.set(-3.5, 2.5, -2.8);
    scene.add(rimLight);

    // Specular Highlight on Clasp & Chain
    const specLight = new THREE.PointLight(0xffffff, 2.6, 8);
    specLight.position.set(0, 1.5, 2.4);
    scene.add(specLight);

    // Fill Light from below
    const fillLight = new THREE.DirectionalLight(0x5a4530, 0.95);
    fillLight.position.set(0, -2.5, 2);
    scene.add(fillLight);

    // --- PROCEDURAL 3D LUXURY HANDBAG MODEL ---
    const pivot = new THREE.Group();
    scene.add(pivot);

    const initialTex = textureSetsRef.current.noir;

    const leatherMat = new THREE.MeshPhysicalMaterial({
      map: initialTex.diffuseMap,
      bumpMap: initialTex.bumpMap,
      bumpScale: 0.042, // Distinctive, tactile 3D quilted cushion depth!
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.65,
      clearcoatRoughness: 0.14,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf7d774,
      metalness: 0.98,
      roughness: 0.10,
    });

    leatherMaterialsRef.current = [leatherMat];
    goldMaterialsRef.current = [goldMat];

    const bagGroup = new THREE.Group();

    // 1. Trapezoidal Main Bag Body
    const bodyShape = new THREE.Shape();
    const bw1 = 0.84; // bottom half-width
    const bw2 = 0.68; // top half-width
    const bh = 1.05;  // height
    const cr = 0.08;  // corner radius

    bodyShape.moveTo(-bw1 + cr, -bh / 2);
    bodyShape.lineTo(bw1 - cr, -bh / 2);
    bodyShape.quadraticCurveTo(bw1, -bh / 2, bw1 - 0.02, -bh / 2 + cr);
    bodyShape.lineTo(bw2, bh / 2 - cr);
    bodyShape.quadraticCurveTo(bw2, bh / 2, bw2 - cr, bh / 2);
    bodyShape.lineTo(-bw2 + cr, bh / 2);
    bodyShape.quadraticCurveTo(-bw2, bh / 2, -bw2, bh / 2 - cr);
    bodyShape.lineTo(-bw1 + 0.02, -bh / 2 + cr);
    bodyShape.quadraticCurveTo(-bw1, -bh / 2, -bw1 + cr, -bh / 2);

    const extrudeSettings = {
      steps: 2,
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 5,
    };

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeo.center();
    const bagBody = new THREE.Mesh(bodyGeo, leatherMat);
    bagGroup.add(bagBody);

    // 2. Sculpted Front Flap with Gold Border Bead
    const flapShape = new THREE.Shape();
    const fw = 0.70;
    const fh = 0.60;
    flapShape.moveTo(-fw, fh / 2);
    flapShape.lineTo(fw, fh / 2);
    flapShape.lineTo(fw, -fh / 2 + 0.12);
    flapShape.quadraticCurveTo(fw, -fh / 2, fw - 0.12, -fh / 2);
    flapShape.lineTo(-fw + 0.12, -fh / 2);
    flapShape.quadraticCurveTo(-fw, -fh / 2, -fw, -fh / 2 + 0.12);
    flapShape.closePath();

    const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
      steps: 1,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 4,
    });
    flapGeo.center();
    const flapMesh = new THREE.Mesh(flapGeo, leatherMat);
    flapMesh.position.set(0, 0.10, 0.19);
    bagGroup.add(flapMesh);

    // Flap Gold Trim Edge
    const flapTrimCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-fw, 0.28, 0.22),
      new THREE.Vector3(-fw, -fh / 2 + 0.1, 0.22),
      new THREE.Vector3(0, -fh / 2 - 0.02, 0.22),
      new THREE.Vector3(fw, -fh / 2 + 0.1, 0.22),
      new THREE.Vector3(fw, 0.28, 0.22),
    ]);
    const flapTrimGeo = new THREE.TubeGeometry(flapTrimCurve, 32, 0.013, 12, false);
    const flapTrimMesh = new THREE.Mesh(flapTrimGeo, goldMat);
    bagGroup.add(flapTrimMesh);

    // 3. Iconic 3D OLIUS Monogram Gold Clasp & Turn-lock
    const claspMedallionGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.025, 36);
    const claspMedallion = new THREE.Mesh(claspMedallionGeo, goldMat);
    claspMedallion.rotation.x = Math.PI / 2;
    claspMedallion.position.set(0, -0.06, 0.23);
    bagGroup.add(claspMedallion);

    // Embossed "O" monogram on the lock medallion
    const oMonogramGeo = new THREE.TorusGeometry(0.068, 0.012, 12, 32);
    const oMonogram = new THREE.Mesh(oMonogramGeo, goldMat);
    oMonogram.position.set(0, -0.06, 0.245);
    bagGroup.add(oMonogram);

    // Concentric beaded ring around medallion
    const ringBeadGeo = new THREE.TorusGeometry(0.155, 0.013, 12, 36);
    const ringBead = new THREE.Mesh(ringBeadGeo, goldMat);
    ringBead.position.set(0, -0.06, 0.23);
    bagGroup.add(ringBead);

    // Rotating turn-lock bar in center
    const lockBarGeo = new THREE.BoxGeometry(0.20, 0.045, 0.05);
    const lockBar = new THREE.Mesh(lockBarGeo, goldMat);
    lockBar.position.set(0, -0.06, 0.25);
    bagGroup.add(lockBar);

    // 4. Horizontal Leather Sangler Straps with Gold Slide Buckles
    const sangleGeo = new THREE.BoxGeometry(0.16, 0.055, 0.03);
    const leftSangleGold = new THREE.Mesh(sangleGeo, goldMat);
    leftSangleGold.position.set(-0.46, -0.06, 0.21);
    const rightSangleGold = new THREE.Mesh(sangleGeo, goldMat);
    rightSangleGold.position.set(0.46, -0.06, 0.21);
    bagGroup.add(leftSangleGold, rightSangleGold);

    // 5. Draped 24K Gold Chain Arc across the front
    const chainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.44, 0.48, 0.19),
      new THREE.Vector3(-0.30, 0.02, 0.26),
      new THREE.Vector3(0, -0.08, 0.28),
      new THREE.Vector3(0.30, 0.02, 0.26),
      new THREE.Vector3(0.44, 0.48, 0.19),
    ]);
    const chainGeo = new THREE.TubeGeometry(chainCurve, 40, 0.015, 12, false);
    const chainMesh = new THREE.Mesh(chainGeo, goldMat);
    bagGroup.add(chainMesh);

    // 6. Sculpted Arched Leather Handle with 4 Gold D-Rings
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 0.52, 0),
      new THREE.Vector3(-0.28, 0.76, 0),
      new THREE.Vector3(0, 0.82, 0),
      new THREE.Vector3(0.28, 0.76, 0),
      new THREE.Vector3(0.34, 0.52, 0),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 36, 0.042, 16, false);
    const handleMesh = new THREE.Mesh(handleGeo, leatherMat);
    bagGroup.add(handleMesh);

    // Gold D-Rings Anchoring Handle
    const ringGeo = new THREE.TorusGeometry(0.065, 0.016, 12, 28);
    const leftRing = new THREE.Mesh(ringGeo, goldMat);
    leftRing.position.set(-0.34, 0.52, 0);
    leftRing.rotation.y = Math.PI / 2;
    const rightRing = new THREE.Mesh(ringGeo, goldMat);
    rightRing.position.set(0.34, 0.52, 0);
    rightRing.rotation.y = Math.PI / 2;
    bagGroup.add(leftRing, rightRing);

    // 7. Hanging Leather Clochette + 3D Golden Padlock
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.28, 0.70, 0.04),
      new THREE.Vector3(0.32, 0.48, 0.16),
      new THREE.Vector3(0.36, 0.28, 0.23),
    ]);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 18, 0.013, 8, false);
    const strapMesh = new THREE.Mesh(strapGeo, leatherMat);
    bagGroup.add(strapMesh);

    const clochetteGeo = new THREE.ConeGeometry(0.08, 0.18, 18);
    const clochetteMesh = new THREE.Mesh(clochetteGeo, leatherMat);
    clochetteMesh.position.set(0.36, 0.19, 0.23);
    bagGroup.add(clochetteMesh);

    // Golden Padlock next to clochette
    const padlockBodyGeo = new THREE.BoxGeometry(0.06, 0.075, 0.03);
    const padlockBody = new THREE.Mesh(padlockBodyGeo, goldMat);
    padlockBody.position.set(0.32, 0.14, 0.24);
    const padlockShackleGeo = new THREE.TorusGeometry(0.032, 0.008, 8, 16, Math.PI);
    const padlockShackle = new THREE.Mesh(padlockShackleGeo, goldMat);
    padlockShackle.position.set(0.32, 0.18, 0.24);
    bagGroup.add(padlockBody, padlockShackle);

    // 8. Back Side Quilted Pocket with Gold Zipper Pull (So 360° is gorgeous from behind!)
    const backPocketGeo = new THREE.BoxGeometry(1.22, 0.62, 0.035);
    const backPocket = new THREE.Mesh(backPocketGeo, leatherMat);
    backPocket.position.set(0, -0.05, -0.17);
    bagGroup.add(backPocket);

    const backZipperGeo = new THREE.BoxGeometry(0.9, 0.025, 0.015);
    const backZipper = new THREE.Mesh(backZipperGeo, goldMat);
    backZipper.position.set(0, 0.24, -0.19);
    bagGroup.add(backZipper);

    // 9. Protective 4 Gold Studs on Bottom
    const studGeo = new THREE.ConeGeometry(0.038, 0.05, 18);
    const studPositions = [
      [-0.64, -0.58, -0.10],
      [0.64, -0.58, -0.10],
      [-0.64, -0.58, 0.10],
      [0.64, -0.58, 0.10],
    ];
    studPositions.forEach(([x, y, z]) => {
      const stud = new THREE.Mesh(studGeo, goldMat);
      stud.position.set(x, y, z);
      stud.rotation.x = Math.PI;
      bagGroup.add(stud);
    });

    pivot.add(bagGroup);

    // --- GSAP CONTEXT (ENTRANCE + SCROLLTRIGGER) ---
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        pivot.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        { x: 1, y: 1, z: 1, duration: 2, ease: "expo.out" }
      );

      // --- SCROLLTRIGGER PIN & 3D ROTATION ---
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=280%",
        pin: true,
        scrub: 1.8,
        anticipatePin: 1,
        fastScrollEnd: 1800,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;

          // Typography Crossfades
          if (title1Ref.current && title2Ref.current && title3Ref.current) {
            if (p < 0.35) {
              const f1 = 1 - p / 0.35;
              title1Ref.current.style.opacity = Math.max(0, f1);
              title2Ref.current.style.opacity = 0;
              title3Ref.current.style.opacity = 0;
            } else if (p < 0.7) {
              const f2 = (p - 0.35) / 0.35;
              title1Ref.current.style.opacity = 0;
              title2Ref.current.style.opacity = Math.sin(f2 * Math.PI);
              title3Ref.current.style.opacity = 0;
            } else {
              const f3 = (p - 0.7) / 0.3;
              title1Ref.current.style.opacity = 0;
              title2Ref.current.style.opacity = 0;
              title3Ref.current.style.opacity = Math.min(1, f3 * 1.5);
            }
          }
        },
      });
    }, container);

    // --- ANIMATION RAF LOOP ---
    const startTime = performance.now();
    let animId;

    const tick = () => {
      const time = (performance.now() - startTime) * 0.001;

      // Lerp drag rotation
      currentDragRot.current.x += (targetDragRot.current.x - currentDragRot.current.x) * 0.08;
      currentDragRot.current.y += (targetDragRot.current.y - currentDragRot.current.y) * 0.08;

      // Lerp mouse tilt
      currentMouseTilt.current.x += (targetMouseTilt.current.x - currentMouseTilt.current.x) * 0.05;
      currentMouseTilt.current.y += (targetMouseTilt.current.y - currentMouseTilt.current.y) * 0.05;

      // Organic weightless floating bob
      const floatY = Math.sin(time * 1.5) * 0.025;
      const floatRotZ = Math.cos(time * 1.1) * 0.016;

      // Scroll-driven 3D angle (smooth luxury presentation, avoids extreme side-facing)
      const p = scrollProgressRef.current;
      const scrollRotY = Math.sin(p * Math.PI) * 0.42;
      const scrollPitchX = Math.sin(p * Math.PI) * 0.16;
      const scrollElevation = -p * 0.08;
      const scrollScale = 1 + Math.sin(p * Math.PI * 0.8) * 0.10;

      // Vertical offset ensures handle stays comfortably below the LUXÉA title
      pivot.position.y = -0.14 + floatY + scrollElevation;
      pivot.scale.setScalar(scrollScale);

      // Combined 3D rotation: Manual drag + Scroll scrub + Mouse tilt + Idle float
      pivot.rotation.y = currentDragRot.current.y + scrollRotY + currentMouseTilt.current.x;
      pivot.rotation.x = currentDragRot.current.x + scrollPitchX + currentMouseTilt.current.y;
      pivot.rotation.z = floatRotZ;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!canvas || !container) return;
      const w = canvas.clientWidth || container.clientWidth;
      const h = canvas.clientHeight || container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      renderer.dispose();
      scene.clear();
      bodyGeo.dispose();
      flapGeo.dispose();
      handleGeo.dispose();
      leatherMat.dispose();
      goldMat.dispose();
    };
  }, []);

  // --- MOUSE / TOUCH INTERACTION HANDLERS ---
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    targetMouseTilt.current = {
      x: ((e.clientX / innerWidth) - 0.5) * 0.32,
      y: ((e.clientY / innerHeight) - 0.5) * 0.22,
    };

    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;

    targetDragRot.current.y += deltaX * 0.009;
    targetDragRot.current.x += deltaY * 0.007;
    targetDragRot.current.x = Math.max(-0.9, Math.min(0.9, targetDragRot.current.x));

    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
    const deltaY = e.touches[0].clientY - prevMouseRef.current.y;

    targetDragRot.current.y += deltaX * 0.012;
    targetDragRot.current.x += deltaY * 0.009;
    targetDragRot.current.x = Math.max(-0.9, Math.min(0.9, targetDragRot.current.x));

    prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#0A0A0A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      {/* Ambient background light field */}
      <div
        style={{
          position: "absolute",
          width: "85vw",
          height: "85vw",
          maxWidth: "950px",
          maxHeight: "950px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200, 183, 156, 0.15) 0%, rgba(10, 10, 10, 0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header: Season & Brand */}
      <div
        style={{
          position: "absolute",
          top: "clamp(88px, 10vh, 108px)",
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(10px, 1.1vw, 12px)",
            letterSpacing: "0.45em",
            color: "rgba(200, 183, 156, 0.85)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "6px",
          }}
        >
          THU / ĐÔNG 2026 · TRIỂN LÃM TÚI XÁCH SỐ 3D OLIUS
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(44px, 7vw, 90px)",
            fontWeight: 300,
            letterSpacing: "0.26em",
            color: "#F4F0E8",
            lineHeight: 1,
            margin: 0,
            textIndent: "0.26em",
            textShadow: "0 8px 32px rgba(0,0,0,0.9)",
          }}
        >
          OLIUS
        </h1>
      </div>

      {/* Central 3D WebGL Canvas Stage */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        data-cursor="rotate"
        style={{
          position: "relative",
          zIndex: 15,
          width: "100%",
          maxWidth: "1000px",
          height: "clamp(380px, 60vh, 650px)",
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Soft Contact Floor Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "55%",
            height: "36px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(200, 183, 156, 0.4) 0%, rgba(10, 10, 10, 0) 72%)",
            filter: "blur(18px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Real Three.js Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            zIndex: 2,
            outline: "none",
          }}
        />

        {/* Hotspot 1: Real 3D Turntable Badge */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onInspect) onInspect("noir");
          }}
          data-cursor="explore"
          style={{
            position: "absolute",
            top: "22%",
            left: "8%",
            backgroundColor: "rgba(10, 10, 10, 0.85)",
            color: "#F4F0E8",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "10px",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.2em",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
            border: "1px solid rgba(200, 183, 156, 0.45)",
            backdropFilter: "blur(12px)",
            transition: "transform 0.3s ease, border-color 0.3s ease",
            zIndex: 25,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ✦ 360° REAL 3D TURNTABLE
        </div>

        {/* Hotspot 2: Leather Craftsmanship */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onInspect) onInspect("noir");
          }}
          data-cursor="explore"
          style={{
            position: "absolute",
            bottom: "22%",
            right: "8%",
            backgroundColor: "rgba(10, 10, 10, 0.85)",
            color: "#F4F0E8",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "10px",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.2em",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
            border: "1px solid rgba(200, 183, 156, 0.45)",
            backdropFilter: "blur(12px)",
            transition: "transform 0.3s ease, border-color 0.3s ease",
            zIndex: 25,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ✦ DA BÊ Ý · HỌA TIẾT QUẢ TRÁM
        </div>
      </div>

      {/* Live Colorway / Material Variant Selector */}
      <div
        style={{
          position: "absolute",
          bottom: "13vh",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 25,
          backgroundColor: "rgba(18, 18, 18, 0.85)",
          padding: "6px 14px",
          borderRadius: "30px",
          border: "1px solid rgba(200, 183, 156, 0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "9px",
            letterSpacing: "0.25em",
            color: "rgba(244, 240, 232, 0.55)",
            textTransform: "uppercase",
            marginRight: "4px",
          }}
        >
          BẢN MÀU:
        </span>
        {colorways.map((c) => {
          const isSelected = activeColorway === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleColorwayChange(c.id)}
              style={{
                background: isSelected ? "rgba(200, 183, 156, 0.22)" : "transparent",
                border: isSelected ? "1px solid #C8B79C" : "1px solid rgba(255, 255, 255, 0.12)",
                color: isSelected ? "#F4F0E8" : "rgba(244, 240, 232, 0.65)",
                padding: "5px 12px",
                borderRadius: "16px",
                fontSize: "10px",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.15em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.25s ease",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: c.base,
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "inline-block",
                  boxShadow: isSelected ? "0 0 8px rgba(200, 183, 156, 0.8)" : "none",
                }}
              />
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Morphing Taglines */}
      <div
        style={{
          position: "absolute",
          bottom: "7vh",
          width: "100%",
          textAlign: "center",
          zIndex: 20,
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <p
          ref={title1Ref}
          style={{
            position: "absolute",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(18px, 2.6vw, 32px)",
            fontWeight: 400,
            letterSpacing: "0.24em",
            color: "#F4F0E8",
            textTransform: "uppercase",
            margin: 0,
            opacity: 1,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            transition: "opacity 0.25s ease",
          }}
        >
          KIẾN TRÚC CỦA BÓNG TỐI
        </p>
        <p
          ref={title2Ref}
          style={{
            position: "absolute",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(18px, 2.6vw, 32px)",
            fontWeight: 400,
            letterSpacing: "0.24em",
            color: "#C8B79C",
            textTransform: "uppercase",
            margin: 0,
            opacity: 0,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            transition: "opacity 0.25s ease",
          }}
        >
          CHẾ TÁC TỪ SỰ HOÀN MỸ
        </p>
        <p
          ref={title3Ref}
          style={{
            position: "absolute",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(18px, 2.6vw, 32px)",
            fontWeight: 400,
            letterSpacing: "0.24em",
            color: "#F4F0E8",
            textTransform: "uppercase",
            margin: 0,
            opacity: 0,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            transition: "opacity 0.25s ease",
          }}
        >
          DÀNH RIÊNG CHO NÀNG
        </p>
      </div>

      {/* Drag & Scroll Prompt */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(244, 240, 232, 0.6)",
            textTransform: "uppercase",
          }}
        >
          KÉO ĐỂ XOAY TÚI 3D THẬT · CUỘN ĐỂ KHÁM PHÁ
        </span>
        <div
          style={{
            width: "1px",
            height: "22px",
            backgroundColor: "rgba(200, 183, 156, 0.45)",
            transformOrigin: "top",
            animation: "pulseSubtle 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite",
          }}
        />
      </div>
    </section>
  );
}
