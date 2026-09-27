"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection({ onInspect, isLoaded = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const floorShadowRef = useRef(null);
  const hotspotsRef = useRef(null);
  const colorwayRef = useRef(null);
  const taglinesRef = useRef(null);
  const promptRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);

  const [activeColorway, setActiveColorway] = useState("noir");
  const activeColorwayRef = useRef("noir");

  // Interaction refs (avoid React re-renders on 60fps frame loops)
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  // Initial angle: Front 3/4 perspective to showcase the 24K gold lock and quilted flap
  const targetDragRot = useRef({ x: 0.04, y: 0.14 });
  const currentDragRot = useRef({ x: 0.04, y: 0.14 });
  const targetMouseTilt = useRef({ x: 0, y: 0 });
  const currentMouseTilt = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const lastInteractionTime = useRef(Date.now());

  // Smooth gradual 3D entrance animation state
  const entranceRef = useRef({
    scale: 0.12,     // starts small / distant
    yOffset: -0.45,  // starts lowered down
    rotY: -0.42,     // starts angled slightly
  });
  const hasAnimatedEntrance = useRef(false);

  const triggerEntranceAnimation = () => {
    if (hasAnimatedEntrance.current) return;
    hasAnimatedEntrance.current = true;

    // 1. Smooth 3D Bag entrance (rises, expands, aligns into beauty angle)
    gsap.to(entranceRef.current, {
      scale: 1,
      yOffset: 0,
      rotY: 0,
      duration: 2.5,
      delay: 0.15,
      ease: "power3.out",
    });

    // 2. Canvas fade-in
    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        opacity: 1,
        duration: 1.8,
        delay: 0.1,
        ease: "power2.out",
      });
    }

    // 3. Floor shadow grows beneath the rising bag
    if (floorShadowRef.current) {
      gsap.fromTo(
        floorShadowRef.current,
        { opacity: 0, transform: "translateX(-50%) scale(0.2)" },
        {
          opacity: 1,
          transform: "translateX(-50%) scale(1)",
          duration: 2.4,
          delay: 0.25,
          ease: "power3.out",
        }
      );
    }

    // 4. Header title reveals gently
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.6, delay: 0.5, ease: "power3.out" }
      );
    }

    // 5. Hotspot badges fade in
    if (hotspotsRef.current) {
      gsap.fromTo(
        hotspotsRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.4, delay: 0.8, ease: "power2.out" }
      );
    }

    // 6. Colorway selector pill glides up
    if (colorwayRef.current) {
      gsap.fromTo(
        colorwayRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.4, delay: 0.95, ease: "power3.out" }
      );
    }

    // 7. Morphing taglines & prompt
    if (taglinesRef.current) {
      gsap.fromTo(
        taglinesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, delay: 0.7, ease: "power2.out" }
      );
    }
    if (promptRef.current) {
      gsap.fromTo(
        promptRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, delay: 1.1, ease: "power2.out" }
      );
    }
  };

  useEffect(() => {
    if (isLoaded) {
      triggerEntranceAnimation();
    }
  }, [isLoaded]);

  useEffect(() => {
    // Safety fallback timer if no preloader or if isLoaded is delayed
    const fallbackTimer = setTimeout(() => {
      triggerEntranceAnimation();
    }, 2800);
    return () => clearTimeout(fallbackTimer);
  }, []);

  const leatherMaterialsRef = useRef([]);
  const goldMaterialsRef = useRef([]);
  const textureSetsRef = useRef({});

  const colorways = [
    {
      id: "noir",
      name: "NOIR 01",
      model: "OLIUS NOIR ROYALE",
      badge1: "✦ CHARM CHỮ OLIUS VÀNG 24K",
      badge2: "✦ DA BÊ Ý · HỌA TIẾT CANNAGE 3D",
      base: "#141416",
      gold: "#F5D061",
      tag: "KIẾN TRÚC CỦA BÓNG TỐI",
    },
    {
      id: "eclat",
      name: "COGNAC 02",
      model: "OLIUS ÉCLAT VENDÔME",
      badge1: "✦ CHUỖI NGỌC TRAI NƯỚC NGỌT · DA COGNAC",
      badge2: "✦ KHÓA BẤM VÀNG 24K · ĐAI YÊN NGỰA",
      base: "#926338",
      gold: "#EAD4A0",
      tag: "CHẾ TÁC TỪ SỰ HOÀN MỸ",
    },
    {
      id: "rose",
      name: "ROSE 03",
      model: "OLIUS ROSE SOIRÉE",
      badge1: "✦ MẶT KHÓA ĐÁ QUÝ RUBY · HALO KIM CƯƠNG",
      badge2: "✦ TUA RUA LỤA VÀNG · XÍCH THÁC NƯỚC 3 TẦNG",
      base: "#703542",
      gold: "#E8BCA8",
      tag: "DÀNH RIÊNG CHO NÀNG",
    },
  ];

  const handleColorwayChange = (id) => {
    setActiveColorway(id);
    activeColorwayRef.current = id;
    const trigger = ScrollTrigger.getById("hero-scroll");
    if (trigger) {
      const targetP = id === "noir" ? 0.08 : id === "eclat" ? 0.48 : 0.85;
      const targetScroll = trigger.start + targetP * (trigger.end - trigger.start);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
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
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- PROCEDURAL STUDIO ENVIRONMENT REFLECTIONS (PMREM) ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0e0e10);

    const sb1Geo = new THREE.PlaneGeometry(8, 8);
    const sb1Mat = new THREE.MeshBasicMaterial({ color: 0xfffaea, side: THREE.DoubleSide });
    const sb1 = new THREE.Mesh(sb1Geo, sb1Mat);
    sb1.position.set(4, 5, 4);
    sb1.lookAt(0, 0, 0);
    envScene.add(sb1);

    const sb2Geo = new THREE.PlaneGeometry(8, 12);
    const sb2Mat = new THREE.MeshBasicMaterial({ color: 0xf5d898, side: THREE.DoubleSide });
    const sb2 = new THREE.Mesh(sb2Geo, sb2Mat);
    sb2.position.set(-5, 4, -4);
    sb2.lookAt(0, 0, 0);
    envScene.add(sb2);

    const sb3Geo = new THREE.PlaneGeometry(10, 4);
    const sb3Mat = new THREE.MeshBasicMaterial({ color: 0xe0e6f2, side: THREE.DoubleSide });
    const sb3 = new THREE.Mesh(sb3Geo, sb3Mat);
    sb3.position.set(0, -3, 5);
    sb3.lookAt(0, 0, 0);
    envScene.add(sb3);

    const envTex = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();
    sb1Geo.dispose();
    sb1Mat.dispose();
    sb2Geo.dispose();
    sb2Mat.dispose();
    sb3Geo.dispose();
    sb3Mat.dispose();
    envScene.clear();

    // --- PROCEDURAL LUXURY LEATHER TEXTURE GENERATORS ---
    // 1. Classic Dior Cannage 3D Pillowed Quilt (Noir)
    const createQuiltedTextureSet = (baseColor, stitchColor) => {
      const size = 1024;
      const cvs = document.createElement("canvas");
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext("2d");

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, size, size);

      // Fine leather grain micro-noise
      const imgData = ctx.getImageData(0, 0, size, size);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      // Authentic Cannage Diamond scale (~5-6 cushions across bag width)
      const step = 128;

      // Subtle cushion gradient (soft ambient lighting)
      for (let y = -step; y < size + step; y += step) {
        for (let x = -step; x < size + step; x += step) {
          const cx = x + step / 2;
          const cy = y + step / 2;
          const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, step * 0.70);
          radGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
          radGrad.addColorStop(0.65, "rgba(0, 0, 0, 0.05)");
          radGrad.addColorStop(1, "rgba(0, 0, 0, 0.45)");

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = radGrad;
          ctx.fillRect(-step * 0.48, -step * 0.48, step * 0.96, step * 0.96);
          ctx.restore();
        }
      }

      // Seam Grooves (Deep debossed shadow)
      ctx.lineWidth = 3.0;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
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

      // Delicate Silk Saddle Stitches along the seam valleys
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = stitchColor;
      ctx.setLineDash([5, 4]);
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
      ctx.setLineDash([]);

      const diffuseMap = new THREE.CanvasTexture(cvs);
      diffuseMap.wrapS = THREE.RepeatWrapping;
      diffuseMap.wrapT = THREE.RepeatWrapping;
      diffuseMap.repeat.set(1.0, 1.0);

      // Physical 3D Pillowed Depth Bump Map
      const bcvs = document.createElement("canvas");
      bcvs.width = 512;
      bcvs.height = 512;
      const bctx = bcvs.getContext("2d");
      bctx.fillStyle = "#808080";
      bctx.fillRect(0, 0, 512, 512);

      const bstep = 64;
      for (let y = -bstep; y < 512 + bstep; y += bstep) {
        for (let x = -bstep; x < 512 + bstep; x += bstep) {
          const cx = x + bstep / 2;
          const cy = y + bstep / 2;
          const bGrad = bctx.createRadialGradient(cx, cy, 0, cx, cy, bstep * 0.72);
          bGrad.addColorStop(0, "#FFFFFF");
          bGrad.addColorStop(0.65, "#909090");
          bGrad.addColorStop(1, "#151515");

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
      bumpMap.repeat.set(1.0, 1.0);

      return { diffuseMap, bumpMap };
    };

    // 2. Chevron Herringbone Luxury Texture (Éclat - Rich Warm Cognac Leather)
    const createChevronTextureSet = (baseColor, stitchColor) => {
      const size = 1024;
      const cvs = document.createElement("canvas");
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext("2d");

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, size, size);

      const imgData = ctx.getImageData(0, 0, size, size);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 12;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const step = 64;
      for (let y = -step; y < size + step * 2; y += step) {
        // Deep Seam Groove
        ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
        ctx.lineWidth = 2.8;
        ctx.setLineDash([]);
        ctx.beginPath();
        for (let x = 0; x <= size; x += step * 2) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + step, y + step * 0.65);
          ctx.lineTo(x + step * 2, y);
        }
        ctx.stroke();

        // Cream / Ecru Saddle Stitches
        ctx.strokeStyle = stitchColor;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        for (let x = 0; x <= size; x += step * 2) {
          ctx.moveTo(x, y - 1);
          ctx.lineTo(x + step, y + step * 0.65 - 1);
          ctx.lineTo(x + step * 2, y - 1);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const diffuseMap = new THREE.CanvasTexture(cvs);
      diffuseMap.wrapS = THREE.RepeatWrapping;
      diffuseMap.wrapT = THREE.RepeatWrapping;
      diffuseMap.repeat.set(1.2, 1.2);

      const bcvs = document.createElement("canvas");
      bcvs.width = 512;
      bcvs.height = 512;
      const bctx = bcvs.getContext("2d");
      bctx.fillStyle = "#808080";
      bctx.fillRect(0, 0, 512, 512);

      const bstep = 32;
      for (let y = -bstep; y < 512 + bstep * 2; y += bstep) {
        bctx.strokeStyle = "#252525";
        bctx.lineWidth = 3.2;
        bctx.beginPath();
        for (let x = 0; x <= 512; x += bstep * 2) {
          bctx.moveTo(x, y);
          bctx.lineTo(x + bstep, y + bstep * 0.65);
          bctx.lineTo(x + bstep * 2, y);
        }
        bctx.stroke();

        bctx.strokeStyle = "#ffffff";
        bctx.lineWidth = 1.6;
        bctx.beginPath();
        for (let x = 0; x <= 512; x += bstep * 2) {
          bctx.moveTo(x, y - 2);
          bctx.lineTo(x + bstep, y + bstep * 0.65 - 2);
          bctx.lineTo(x + bstep * 2, y - 2);
        }
        bctx.stroke();
      }

      const bumpMap = new THREE.CanvasTexture(bcvs);
      bumpMap.wrapS = THREE.RepeatWrapping;
      bumpMap.wrapT = THREE.RepeatWrapping;
      bumpMap.repeat.set(1.2, 1.2);

      return { diffuseMap, bumpMap };
    };

    // 3. Fine Micro-Quilt (Rose)
    const createMicroQuiltTextureSet = (baseColor, stitchColor) => {
      const size = 1024;
      const cvs = document.createElement("canvas");
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext("2d");

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, size, size);

      const imgData = ctx.getImageData(0, 0, size, size);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 12;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const step = 80;
      for (let y = -step; y < size + step; y += step) {
        for (let x = -step; x < size + step; x += step) {
          const cx = x + step / 2;
          const cy = y + step / 2;
          const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, step * 0.70);
          radGrad.addColorStop(0, "rgba(255, 235, 235, 0.14)");
          radGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.06)");
          radGrad.addColorStop(1, "rgba(40, 10, 10, 0.42)");

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = radGrad;
          ctx.fillRect(-step * 0.48, -step * 0.48, step * 0.96, step * 0.96);
          ctx.restore();
        }
      }

      ctx.lineWidth = 2.4;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
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

      ctx.lineWidth = 1.3;
      ctx.strokeStyle = stitchColor;
      ctx.setLineDash([4, 3]);
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
      ctx.setLineDash([]);

      const diffuseMap = new THREE.CanvasTexture(cvs);
      diffuseMap.wrapS = THREE.RepeatWrapping;
      diffuseMap.wrapT = THREE.RepeatWrapping;
      diffuseMap.repeat.set(1.2, 1.2);

      const bcvs = document.createElement("canvas");
      bcvs.width = 512;
      bcvs.height = 512;
      const bctx = bcvs.getContext("2d");
      bctx.fillStyle = "#808080";
      bctx.fillRect(0, 0, 512, 512);

      const bstep = 40;
      for (let y = -bstep; y < 512 + bstep; y += bstep) {
        for (let x = -bstep; x < 512 + bstep; x += bstep) {
          const cx = x + bstep / 2;
          const cy = y + bstep / 2;
          const bGrad = bctx.createRadialGradient(cx, cy, 0, cx, cy, bstep * 0.7);
          bGrad.addColorStop(0, "#FFFFFF");
          bGrad.addColorStop(0.65, "#888888");
          bGrad.addColorStop(1, "#181818");

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
      bumpMap.repeat.set(1.2, 1.2);

      return { diffuseMap, bumpMap };
    };

    // Textures for 3 distinct bags
    const noirTex = createQuiltedTextureSet("#141416", "rgba(200, 175, 130, 0.40)");
    const eclatTex = createChevronTextureSet("#926338", "rgba(240, 225, 205, 0.60)");
    const roseTex = createMicroQuiltTextureSet("#703542", "rgba(245, 195, 195, 0.50)");

    // Physical Leather Materials
    const noirLeatherMat = new THREE.MeshPhysicalMaterial({
      map: noirTex.diffuseMap,
      bumpMap: noirTex.bumpMap,
      bumpScale: 0.038,
      roughness: 0.35,
      metalness: 0.04,
      clearcoat: 0.70,
      clearcoatRoughness: 0.16,
      sheen: 0.40,
      sheenColor: new THREE.Color(0xd4af37),
    });

    const eclatLeatherMat = new THREE.MeshPhysicalMaterial({
      map: eclatTex.diffuseMap,
      bumpMap: eclatTex.bumpMap,
      bumpScale: 0.036,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.14,
      sheen: 0.45,
      sheenColor: new THREE.Color(0xf5d0a0),
    });

    const roseLeatherMat = new THREE.MeshPhysicalMaterial({
      map: roseTex.diffuseMap,
      bumpMap: roseTex.bumpMap,
      bumpScale: 0.036,
      roughness: 0.34,
      metalness: 0.06,
      clearcoat: 0.72,
      clearcoatRoughness: 0.15,
      sheen: 0.50,
      sheenColor: new THREE.Color(0xf5b5b5),
    });

    // 24K Gold Hardware Materials with reflection
    const noirGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf5d061,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.2,
    });

    const eclatGoldMat = new THREE.MeshStandardMaterial({
      color: 0xead4a0,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.2,
    });

    const roseGoldMat = new THREE.MeshStandardMaterial({
      color: 0xe8bca8,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.2,
    });

    // Haute Specialty Materials
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xfefaf2,
      roughness: 0.10,
      metalness: 0.05,
      clearcoat: 0.96,
      clearcoatRoughness: 0.06,
      sheen: 0.85,
      sheenColor: new THREE.Color(0xffe6cb),
      iridescence: 0.88,
      iridescenceIOR: 1.45,
    });

    const rubyGemMat = new THREE.MeshPhysicalMaterial({
      color: 0xd62250,
      roughness: 0.02,
      metalness: 0.12,
      transmission: 0.86,
      opacity: 1,
      transparent: true,
      ior: 1.78,
    });

    const onyxMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.12,
      metalness: 0.80,
    });

    // Studio Lighting (Carefully balanced to eliminate all white glare)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaee, 1.8);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.5);
    rimLight.position.set(-3.5, 2.5, -2.8);
    scene.add(rimLight);

    const specLight = new THREE.PointLight(0xffffff, 1.0, 8);
    specLight.position.set(0, 1.5, 2.4);
    scene.add(specLight);

    const fillLight = new THREE.DirectionalLight(0x5a4530, 0.6);
    fillLight.position.set(0, -2.5, 2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffe8c8, 0.8);
    backLight.position.set(0, 2.2, -3.5);
    scene.add(backLight);

    // --- PROCEDURAL 3D LUXURY HANDBAG BUILDERS ---

    // MODEL 1: OLIUS NOIR ROYALE (Classic Flap Haute Bag)
    const createNoirRoyale = (leatherMat, goldMat, onyxMat) => {
      const group = new THREE.Group();

      const bodyShape = new THREE.Shape();
      const bw1 = 0.84;
      const bw2 = 0.68;
      const bh = 1.05;
      const cr = 0.08;
      bodyShape.moveTo(-bw1 + cr, -bh / 2);
      bodyShape.lineTo(bw1 - cr, -bh / 2);
      bodyShape.quadraticCurveTo(bw1, -bh / 2, bw1 - 0.02, -bh / 2 + cr);
      bodyShape.lineTo(bw2, bh / 2 - cr);
      bodyShape.quadraticCurveTo(bw2, bh / 2, bw2 - cr, bh / 2);
      bodyShape.lineTo(-bw2 + cr, bh / 2);
      bodyShape.quadraticCurveTo(-bw2, bh / 2, -bw2, bh / 2 - cr);
      bodyShape.lineTo(-bw1 + 0.02, -bh / 2 + cr);
      bodyShape.quadraticCurveTo(-bw1, -bh / 2, -bw1 + cr, -bh / 2);

      const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        steps: 2,
        depth: 0.28,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 5,
      });
      bodyGeo.center();
      const bagBody = new THREE.Mesh(bodyGeo, leatherMat);
      group.add(bagBody);

      // Flap
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
      flapMesh.position.set(0, 0.10, 0.18);
      group.add(flapMesh);

      // Flap Gold Trim
      const flapTrimCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-fw, 0.28, 0.21),
        new THREE.Vector3(-fw, -fh / 2 + 0.1, 0.21),
        new THREE.Vector3(0, -fh / 2 - 0.01, 0.21),
        new THREE.Vector3(fw, -fh / 2 + 0.1, 0.21),
        new THREE.Vector3(fw, 0.28, 0.21),
      ]);
      const flapTrimGeo = new THREE.TubeGeometry(flapTrimCurve, 32, 0.012, 12, false);
      const flapTrimMesh = new THREE.Mesh(flapTrimGeo, goldMat);
      group.add(flapTrimMesh);

      // Center Lock: Sunburst + Onyx + 24K Monogram
      const sunburstGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.015, 28);
      const sunburstMesh = new THREE.Mesh(sunburstGeo, goldMat);
      sunburstMesh.rotation.x = Math.PI / 2;
      sunburstMesh.position.set(0, -0.06, 0.21);
      group.add(sunburstMesh);

      const onyxGeo = new THREE.CylinderGeometry(0.105, 0.105, 0.018, 32);
      const onyxDisc = new THREE.Mesh(onyxGeo, onyxMat);
      onyxDisc.rotation.x = Math.PI / 2;
      onyxDisc.position.set(0, -0.06, 0.22);
      group.add(onyxDisc);

      const oMonogramGeo = new THREE.TorusGeometry(0.055, 0.010, 12, 32);
      const oMonogram = new THREE.Mesh(oMonogramGeo, goldMat);
      oMonogram.position.set(0, -0.06, 0.23);
      group.add(oMonogram);

      const lockBarGeo = new THREE.BoxGeometry(0.18, 0.038, 0.04);
      const lockBar = new THREE.Mesh(lockBarGeo, goldMat);
      lockBar.position.set(0, -0.06, 0.24);
      group.add(lockBar);

      // Clean Arched Handle
      const handleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.34, 0.52, 0),
        new THREE.Vector3(-0.28, 0.76, 0),
        new THREE.Vector3(0, 0.82, 0),
        new THREE.Vector3(0.28, 0.76, 0),
        new THREE.Vector3(0.34, 0.52, 0),
      ]);
      const handleGeo = new THREE.TubeGeometry(handleCurve, 36, 0.040, 16, false);
      const handleMesh = new THREE.Mesh(handleGeo, leatherMat);
      group.add(handleMesh);

      const ringGeo = new THREE.TorusGeometry(0.060, 0.014, 12, 28);
      const leftRing = new THREE.Mesh(ringGeo, goldMat);
      leftRing.position.set(-0.34, 0.52, 0);
      leftRing.rotation.y = Math.PI / 2;
      const rightRing = new THREE.Mesh(ringGeo, goldMat);
      rightRing.position.set(0.34, 0.52, 0);
      rightRing.rotation.y = Math.PI / 2;
      group.add(leftRing, rightRing);

      // Signature 24K Gold "O" Charm Pendant on Left Handle Ring
      const charmDropCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.34, 0.52, 0.06),
        new THREE.Vector3(-0.37, 0.44, 0.12),
        new THREE.Vector3(-0.36, 0.36, 0.16),
      ]);
      const charmDropGeo = new THREE.TubeGeometry(charmDropCurve, 12, 0.005, 6, false);
      const charmDropMesh = new THREE.Mesh(charmDropGeo, goldMat);
      const charmOGeo = new THREE.TorusGeometry(0.042, 0.010, 12, 28);
      const charmOMesh = new THREE.Mesh(charmOGeo, goldMat);
      charmOMesh.position.set(-0.36, 0.32, 0.17);
      group.add(charmDropMesh, charmOMesh);

      // Padlock & Clochette on Right
      const clochetteStrapCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.34, 0.52, 0.06),
        new THREE.Vector3(0.36, 0.40, 0.14),
        new THREE.Vector3(0.35, 0.28, 0.18),
      ]);
      const clochetteStrapGeo = new THREE.TubeGeometry(clochetteStrapCurve, 16, 0.008, 6, false);
      const clochetteStrap = new THREE.Mesh(clochetteStrapGeo, leatherMat);
      const clochetteGeo = new THREE.ConeGeometry(0.05, 0.12, 16);
      const clochetteMesh = new THREE.Mesh(clochetteGeo, leatherMat);
      clochetteMesh.position.set(0.35, 0.22, 0.19);
      const padlockGeo = new THREE.BoxGeometry(0.038, 0.048, 0.02);
      const padlockMesh = new THREE.Mesh(padlockGeo, goldMat);
      padlockMesh.position.set(0.32, 0.18, 0.20);
      group.add(clochetteStrap, clochetteMesh, padlockMesh);

      // Draped 24K Gold Curb Chain (Clear graceful arc below the lock)
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.44, 0.48, 0.16),
        new THREE.Vector3(-0.28, 0.06, 0.22),
        new THREE.Vector3(0, -0.12, 0.24),
        new THREE.Vector3(0.28, 0.06, 0.22),
        new THREE.Vector3(0.44, 0.48, 0.16),
      ]);
      const chainGeo = new THREE.TubeGeometry(chainCurve, 36, 0.014, 10, false);
      const chainMesh = new THREE.Mesh(chainGeo, goldMat);
      group.add(chainMesh);

      // 4 Conical Base Gold Studs
      const studGeo = new THREE.ConeGeometry(0.036, 0.048, 16);
      [
        [-0.64, -0.56, -0.10],
        [0.64, -0.56, -0.10],
        [-0.64, -0.56, 0.10],
        [0.64, -0.56, 0.10],
      ].forEach(([x, y, z]) => {
        const stud = new THREE.Mesh(studGeo, goldMat);
        stud.position.set(x, y, z);
        stud.rotation.x = Math.PI;
        group.add(stud);
      });

      return group;
    };

    // MODEL 2: OLIUS ÉCLAT VENDÔME (Modern Structured Tote in Warm Cognac Leather)
    const createEclatVendome = (leatherMat, goldMat, pearlMat) => {
      const group = new THREE.Group();

      const bodyShape = new THREE.Shape();
      const bw1 = 0.90;
      const bw2 = 0.78;
      const bh = 1.02;
      const cr = 0.07;
      bodyShape.moveTo(-bw1 + cr, -bh / 2);
      bodyShape.lineTo(bw1 - cr, -bh / 2);
      bodyShape.quadraticCurveTo(bw1, -bh / 2, bw1 - 0.02, -bh / 2 + cr);
      bodyShape.lineTo(bw2, bh / 2 - cr);
      bodyShape.quadraticCurveTo(bw2, bh / 2, bw2 - cr, bh / 2);
      bodyShape.lineTo(-bw2 + cr, bh / 2);
      bodyShape.quadraticCurveTo(-bw2, bh / 2, -bw2, bh / 2 - cr);
      bodyShape.lineTo(-bw1 + 0.02, -bh / 2 + cr);
      bodyShape.quadraticCurveTo(-bw1, -bh / 2, -bw1 + cr, -bh / 2);

      const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        steps: 2,
        depth: 0.30,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 5,
      });
      bodyGeo.center();
      const bodyMesh = new THREE.Mesh(bodyGeo, leatherMat);
      group.add(bodyMesh);

      // Vertical Center Saddle Band
      const bandGeo = new THREE.BoxGeometry(0.24, 1.06, 0.02);
      const bandMesh = new THREE.Mesh(bandGeo, leatherMat);
      bandMesh.position.set(0, 0, 0.16);
      group.add(bandMesh);

      const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(0.010, 1.06, 0.012), goldMat);
      leftTrim.position.set(-0.12, 0, 0.17);
      const rightTrim = new THREE.Mesh(new THREE.BoxGeometry(0.010, 1.06, 0.012), goldMat);
      rightTrim.position.set(0.12, 0, 0.17);
      group.add(leftTrim, rightTrim);

      // Rectangular Gold Buckle
      const buckleOuter = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.04), goldMat);
      buckleOuter.position.set(0, 0.05, 0.19);
      group.add(buckleOuter);

      const buckleInner = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 32), goldMat);
      buckleInner.rotation.x = Math.PI / 2;
      buckleInner.position.set(0, 0.05, 0.215);
      group.add(buckleInner);

      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 16), goldMat);
      pin.position.set(0, 0.05, 0.225);
      group.add(pin);

      // Dual Handles (Clean connections into top rim)
      const handleCurveFront = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.30, 0.50, 0.08),
        new THREE.Vector3(-0.25, 0.78, 0.08),
        new THREE.Vector3(0, 0.84, 0.08),
        new THREE.Vector3(0.25, 0.78, 0.08),
        new THREE.Vector3(0.30, 0.50, 0.08),
      ]);
      const handleGeoF = new THREE.TubeGeometry(handleCurveFront, 32, 0.034, 16, false);
      const handleFront = new THREE.Mesh(handleGeoF, leatherMat);

      const handleCurveBack = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.30, 0.50, -0.08),
        new THREE.Vector3(-0.25, 0.78, -0.08),
        new THREE.Vector3(0, 0.84, -0.08),
        new THREE.Vector3(0.25, 0.78, -0.08),
        new THREE.Vector3(0.30, 0.50, -0.08),
      ]);
      const handleGeoB = new THREE.TubeGeometry(handleCurveBack, 32, 0.034, 16, false);
      const handleBack = new THREE.Mesh(handleGeoB, leatherMat);
      group.add(handleFront, handleBack);

      // Sleek Gold Ferrules at the 4 handle anchor points on top rim
      const ferruleGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.035, 20);
      [
        [-0.30, 0.51, 0.08],
        [0.30, 0.51, 0.08],
        [-0.30, 0.51, -0.08],
        [0.30, 0.51, -0.08],
      ].forEach(([x, y, z]) => {
        const ferrule = new THREE.Mesh(ferruleGeo, goldMat);
        ferrule.position.set(x, y, z);
        group.add(ferrule);
      });

      // Draped Freshwater Pearls across Upper Chest (above the buckle)
      const pearlCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.44, 0.38, 0.17),
        new THREE.Vector3(-0.24, 0.24, 0.21),
        new THREE.Vector3(0, 0.20, 0.22),
        new THREE.Vector3(0.24, 0.24, 0.21),
        new THREE.Vector3(0.44, 0.38, 0.17),
      ]);
      const pearlCount = 16;
      for (let i = 0; i <= pearlCount; i++) {
        const pt = pearlCurve.getPoint(i / pearlCount);
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 14), pearlMat);
        pMesh.position.copy(pt);
        group.add(pMesh);
      }

      // Draped Gold Curb Chain below the buckle
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.46, 0.34, 0.16),
        new THREE.Vector3(-0.26, -0.06, 0.21),
        new THREE.Vector3(0, -0.15, 0.23),
        new THREE.Vector3(0.26, -0.06, 0.21),
        new THREE.Vector3(0.46, 0.34, 0.16),
      ]);
      const chainGeo = new THREE.TubeGeometry(chainCurve, 36, 0.013, 10, false);
      const chainMesh = new THREE.Mesh(chainGeo, goldMat);
      group.add(chainMesh);

      // Hanging Luggage Tag on Left
      const tagStrapCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.28, 0.51, 0.09),
        new THREE.Vector3(-0.35, 0.32, 0.18),
        new THREE.Vector3(-0.36, 0.16, 0.20),
      ]);
      const tagStrapGeo = new THREE.TubeGeometry(tagStrapCurve, 16, 0.009, 8, false);
      const tagStrap = new THREE.Mesh(tagStrapGeo, leatherMat);
      group.add(tagStrap);

      const tagBadge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.02), leatherMat);
      tagBadge.position.set(-0.36, 0.08, 0.21);
      tagBadge.rotation.z = 0.10;
      const crestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16), goldMat);
      crestMesh.position.set(-0.36, 0.08, 0.225);
      crestMesh.rotation.x = Math.PI / 2;
      group.add(tagBadge, crestMesh);

      // 4 Base Corner Gold Armor Brackets
      const armorGeo = new THREE.BoxGeometry(0.12, 0.07, 0.07);
      [
        [-0.82, -0.48, 0.14],
        [0.82, -0.48, 0.14],
        [-0.82, -0.48, -0.14],
        [0.82, -0.48, -0.14],
      ].forEach(([x, y, z]) => {
        const aMesh = new THREE.Mesh(armorGeo, goldMat);
        aMesh.position.set(x, y, z);
        group.add(aMesh);
      });

      return group;
    };

    // MODEL 3: OLIUS ROSE SOIRÉE (Haute Evening Pochette)
    const createRoseSoiree = (leatherMat, goldMat, pearlMat, rubyGemMat) => {
      const group = new THREE.Group();

      const bodyShape = new THREE.Shape();
      const bw = 1.18;
      const bh = 0.68;
      const cr = 0.08;
      bodyShape.moveTo(-bw / 2 + cr, -bh / 2);
      bodyShape.lineTo(bw / 2 - cr, -bh / 2);
      bodyShape.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + cr);
      bodyShape.lineTo(bw / 2, bh / 2 - cr);
      bodyShape.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - cr, bh / 2);
      bodyShape.lineTo(-bw / 2 + cr, bh / 2);
      bodyShape.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - cr);
      bodyShape.lineTo(-bw / 2, -bh / 2 + cr);
      bodyShape.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + cr, -bh / 2);

      const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        steps: 2,
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.035,
        bevelSegments: 4,
      });
      bodyGeo.center();
      const bodyMesh = new THREE.Mesh(bodyGeo, leatherMat);
      group.add(bodyMesh);

      // Triangular Flap
      const flapShape = new THREE.Shape();
      const fw = 1.16;
      const fTop = 0.34;
      flapShape.moveTo(-fw / 2, fTop);
      flapShape.lineTo(fw / 2, fTop);
      flapShape.lineTo(fw / 2, 0.06);
      flapShape.lineTo(0, -0.16);
      flapShape.lineTo(-fw / 2, 0.06);
      flapShape.closePath();

      const flapGeo = new THREE.ExtrudeGeometry(flapShape, {
        steps: 1,
        depth: 0.035,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      });
      flapGeo.center();
      const flapMesh = new THREE.Mesh(flapGeo, leatherMat);
      flapMesh.position.set(0, 0.09, 0.15);
      group.add(flapMesh);

      // Gold Trim
      const vCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-fw / 2, 0.14, 0.17),
        new THREE.Vector3(0, -0.07, 0.18),
        new THREE.Vector3(fw / 2, 0.14, 0.17),
      ]);
      const vGeo = new THREE.TubeGeometry(vCurve, 24, 0.012, 10, false);
      const vMesh = new THREE.Mesh(vGeo, goldMat);
      group.add(vMesh);

      // Brooch Clasp with Ruby & Pearls
      const lockBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.04), goldMat);
      lockBase.position.set(0, -0.06, 0.19);
      group.add(lockBase);

      const rubyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.03), rubyGemMat);
      rubyMesh.position.set(0, -0.06, 0.22);
      group.add(rubyMesh);

      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const rx = Math.cos(angle) * 0.10;
        const ry = Math.sin(angle) * 0.07;
        const haloStone = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 10), pearlMat);
        haloStone.position.set(rx, -0.06 + ry, 0.225);
        group.add(haloStone);
      }

      // Golden Silk Tassel
      const capMesh = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.07, 16), goldMat);
      capMesh.position.set(0, -0.16, 0.20);
      const tasselSkirt = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 20), goldMat);
      tasselSkirt.position.set(0, -0.29, 0.20);
      group.add(capMesh, tasselSkirt);

      // Double-Strand Waterfall Chains
      [
        { drop: -0.24, z: 0.22 },
        { drop: -0.38, z: 0.25 },
      ].forEach((layer) => {
        const cCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.58, 0.22, 0.08),
          new THREE.Vector3(-0.32, layer.drop * 0.6, layer.z * 0.9),
          new THREE.Vector3(0, layer.drop, layer.z),
          new THREE.Vector3(0.32, layer.drop * 0.6, layer.z * 0.9),
          new THREE.Vector3(0.58, 0.22, 0.08),
        ]);
        const cGeo = new THREE.TubeGeometry(cCurve, 36, 0.011, 8, false);
        const cMesh = new THREE.Mesh(cGeo, goldMat);
        group.add(cMesh);
      });

      // Side Grommets
      const grommetGeo = new THREE.TorusGeometry(0.045, 0.014, 10, 24);
      const leftGrommet = new THREE.Mesh(grommetGeo, goldMat);
      leftGrommet.position.set(-0.60, 0.26, 0.04);
      leftGrommet.rotation.y = Math.PI / 2;
      const rightGrommet = new THREE.Mesh(grommetGeo, goldMat);
      rightGrommet.position.set(0.60, 0.26, 0.04);
      rightGrommet.rotation.y = Math.PI / 2;
      group.add(leftGrommet, rightGrommet);

      // Corner Base Plates
      const plateGeo = new THREE.BoxGeometry(0.08, 0.08, 0.05);
      [
        [-0.56, -0.32, 0.11],
        [0.56, -0.32, 0.11],
        [-0.56, -0.32, -0.11],
        [0.56, -0.32, -0.11],
      ].forEach(([x, y, z]) => {
        const pMesh = new THREE.Mesh(plateGeo, goldMat);
        pMesh.position.set(x, y, z);
        group.add(pMesh);
      });

      return group;
    };

    // --- PIVOT MOUNTING ---
    const pivot = new THREE.Group();
    scene.add(pivot);

    const bag1Group = createNoirRoyale(noirLeatherMat, noirGoldMat, onyxMat);
    const bag2Group = createEclatVendome(eclatLeatherMat, eclatGoldMat, pearlMat);
    const bag3Group = createRoseSoiree(roseLeatherMat, roseGoldMat, pearlMat, rubyGemMat);

    bag1Group.visible = true;
    bag2Group.visible = false;
    bag3Group.visible = false;
    bag2Group.scale.setScalar(0.001);
    bag3Group.scale.setScalar(0.001);

    pivot.add(bag1Group);
    pivot.add(bag2Group);
    pivot.add(bag3Group);

    // --- GSAP CONTEXT (SCROLLTRIGGER & MULTI-BAG SWITCHING) ---
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "hero-scroll",
        trigger: container,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        fastScrollEnd: 1800,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;

          // Dynamically sync active bag colorway
          let currentId = "noir";
          if (p >= 0.62) {
            currentId = "rose";
          } else if (p >= 0.31) {
            currentId = "eclat";
          }

          if (currentId !== activeColorwayRef.current) {
            activeColorwayRef.current = currentId;
            setActiveColorway(currentId);
          }

          // Typography Crossfades
          if (title1Ref.current && title2Ref.current && title3Ref.current) {
            if (p < 0.33) {
              const f1 = 1 - p / 0.33;
              title1Ref.current.style.opacity = Math.max(0, f1);
              title2Ref.current.style.opacity = 0;
              title3Ref.current.style.opacity = 0;
            } else if (p < 0.66) {
              const f2 = (p - 0.33) / 0.33;
              title1Ref.current.style.opacity = 0;
              title2Ref.current.style.opacity = Math.sin(f2 * Math.PI);
              title3Ref.current.style.opacity = 0;
            } else {
              const f3 = (p - 0.66) / 0.34;
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

      // Auto-return to showroom front 3/4 angle when idle for 2.5s
      if (!isDraggingRef.current && Date.now() - lastInteractionTime.current > 2500) {
        targetDragRot.current.x += (0.04 - targetDragRot.current.x) * 0.025;
        const beautyY = 0.14;
        let diff = (beautyY - targetDragRot.current.y) % (Math.PI * 2);
        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;
        targetDragRot.current.y += diff * 0.025;
      }

      // Lerp drag rotation
      currentDragRot.current.x += (targetDragRot.current.x - currentDragRot.current.x) * 0.08;
      currentDragRot.current.y += (targetDragRot.current.y - currentDragRot.current.y) * 0.08;

      // Lerp mouse tilt
      currentMouseTilt.current.x += (targetMouseTilt.current.x - currentMouseTilt.current.x) * 0.05;
      currentMouseTilt.current.y += (targetMouseTilt.current.y - currentMouseTilt.current.y) * 0.05;

      // Organic weightless floating bob
      const floatY = Math.sin(time * 1.5) * 0.025;
      const floatRotZ = Math.cos(time * 1.1) * 0.016;

      // Scroll-driven 3D angle
      const p = scrollProgressRef.current;
      const scrollRotY = Math.sin(p * Math.PI) * 0.42;
      const scrollPitchX = Math.sin(p * Math.PI) * 0.16;
      const scrollElevation = -p * 0.08;
      const scrollScale = 1 + Math.sin(p * Math.PI * 0.8) * 0.10;

      const ent = entranceRef.current;

      // Vertical offset ensures handle stays comfortably below the OLIUS title
      pivot.position.y = -0.14 + ent.yOffset + floatY + scrollElevation;
      pivot.scale.setScalar(scrollScale * ent.scale);

      // Combined 3D rotation: Manual drag + Scroll scrub + Mouse tilt + Idle float + entrance rotation
      pivot.rotation.y = currentDragRot.current.y + scrollRotY + currentMouseTilt.current.x + ent.rotY;
      pivot.rotation.x = currentDragRot.current.x + scrollPitchX + currentMouseTilt.current.y;
      pivot.rotation.z = floatRotZ;

      // --- MULTI-BAG SCROLL TRANSITION SMOOTH WEIGHTS ---
      const blendWidth = 0.12;
      let w1 = 0, w2 = 0, w3 = 0;
      if (p < 0.33 - blendWidth / 2) {
        w1 = 1; w2 = 0; w3 = 0;
      } else if (p < 0.33 + blendWidth / 2) {
        const t = (p - (0.33 - blendWidth / 2)) / blendWidth;
        const ease = t * t * (3 - 2 * t);
        w1 = 1 - ease;
        w2 = ease;
        w3 = 0;
      } else if (p < 0.66 - blendWidth / 2) {
        w1 = 0; w2 = 1; w3 = 0;
      } else if (p < 0.66 + blendWidth / 2) {
        const t = (p - (0.66 - blendWidth / 2)) / blendWidth;
        const ease = t * t * (3 - 2 * t);
        w1 = 0;
        w2 = 1 - ease;
        w3 = ease;
      } else {
        w1 = 0; w2 = 0; w3 = 1;
      }

      // Transform Bag 1 (Noir Royale)
      bag1Group.visible = w1 > 0.005;
      if (bag1Group.visible) {
        bag1Group.scale.setScalar(Math.max(0.001, w1));
        bag1Group.position.y = (1 - w1) * 0.35;
        bag1Group.rotation.y = (1 - w1) * 0.75;
      }

      // Transform Bag 2 (Éclat Vendôme)
      bag2Group.visible = w2 > 0.005;
      if (bag2Group.visible) {
        bag2Group.scale.setScalar(Math.max(0.001, w2));
        bag2Group.position.y = (1 - w2) * -0.35;
        bag2Group.rotation.y = (1 - w2) * -0.75;
      }

      // Transform Bag 3 (Rose Soirée)
      bag3Group.visible = w3 > 0.005;
      if (bag3Group.visible) {
        bag3Group.scale.setScalar(Math.max(0.001, w3));
        bag3Group.position.y = (1 - w3) * -0.35;
        bag3Group.rotation.y = (1 - w3) * -0.75;
      }

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
      [bag1Group, bag2Group, bag3Group].forEach((g) => {
        g.traverse((child) => {
          if (child.isMesh && child.geometry) child.geometry.dispose();
        });
      });
      noirLeatherMat.dispose();
      eclatLeatherMat.dispose();
      roseLeatherMat.dispose();
      noirGoldMat.dispose();
      eclatGoldMat.dispose();
      roseGoldMat.dispose();
      pearlMat.dispose();
      rubyGemMat.dispose();
      onyxMat.dispose();
      noirTex.diffuseMap.dispose();
      noirTex.bumpMap.dispose();
      eclatTex.diffuseMap.dispose();
      eclatTex.bumpMap.dispose();
      roseTex.diffuseMap.dispose();
      roseTex.bumpMap.dispose();
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
    lastInteractionTime.current = Date.now();
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;

    targetDragRot.current.y += deltaX * 0.009;
    targetDragRot.current.x += deltaY * 0.007;
    targetDragRot.current.x = Math.max(-0.28, Math.min(0.28, targetDragRot.current.x));

    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastInteractionTime.current = Date.now();
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    lastInteractionTime.current = Date.now();
    const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
    const deltaY = e.touches[0].clientY - prevMouseRef.current.y;

    targetDragRot.current.y += deltaX * 0.012;
    targetDragRot.current.x += deltaY * 0.009;
    targetDragRot.current.x = Math.max(-0.28, Math.min(0.28, targetDragRot.current.x));

    prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const currentBag = colorways.find((c) => c.id === activeColorway) || colorways[0];

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
        ref={headerRef}
        style={{
          position: "absolute",
          top: "clamp(88px, 10vh, 108px)",
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none",
          opacity: 0,
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
          ref={floorShadowRef}
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
            opacity: 0,
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
            opacity: 0,
          }}
        />

        {/* Hotspots overlay (absolute positioning prevents flex disruption) */}
        <div
          ref={hotspotsRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 25,
            opacity: 0,
          }}
        >
          {/* Hotspot 1: Real 3D Turntable Badge */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onInspect) onInspect(activeColorway);
            }}
            data-cursor="explore"
            style={{
              position: "absolute",
              top: "20%",
              left: "4%",
              backgroundColor: "rgba(10, 10, 10, 0.85)",
              color: "#F4F0E8",
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "10px",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.2em",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
              border: "1px solid rgba(200, 183, 156, 0.45)",
              backdropFilter: "blur(12px)",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              pointerEvents: "auto",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {currentBag.badge1}
          </div>

          {/* Hotspot 2: Leather Craftsmanship */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onInspect) onInspect(activeColorway);
            }}
            data-cursor="explore"
            style={{
              position: "absolute",
              bottom: "20%",
              right: "4%",
              backgroundColor: "rgba(10, 10, 10, 0.85)",
              color: "#F4F0E8",
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "10px",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.2em",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
              border: "1px solid rgba(200, 183, 156, 0.45)",
              backdropFilter: "blur(12px)",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              pointerEvents: "auto",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {currentBag.badge2}
          </div>
        </div>
      </div>

      {/* Live Colorway / Material Variant Selector */}
      <div
        ref={colorwayRef}
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
          opacity: 0,
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
        ref={taglinesRef}
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
          opacity: 0,
        }}
      >
        <p
          ref={title1Ref}
          style={{
            position: "absolute",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(15px, 2.2vw, 26px)",
            fontWeight: 400,
            letterSpacing: "0.22em",
            color: "#F4F0E8",
            textTransform: "uppercase",
            margin: 0,
            opacity: 1,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            transition: "opacity 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          KIẾN TRÚC CỦA BÓNG TỐI · OLIUS NOIR ROYALE
        </p>
        <p
          ref={title2Ref}
          style={{
            position: "absolute",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(15px, 2.2vw, 26px)",
            fontWeight: 400,
            letterSpacing: "0.22em",
            color: "#EAD4A0",
            textTransform: "uppercase",
            margin: 0,
            opacity: 0,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            transition: "opacity 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          CHẾ TÁC TỪ SỰ HOÀN MỸ · OLIUS ÉCLAT VENDÔME
        </p>
        <p
          ref={title3Ref}
          style={{
            position: "absolute",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(15px, 2.2vw, 26px)",
            fontWeight: 400,
            letterSpacing: "0.22em",
            color: "#E8BCA8",
            textTransform: "uppercase",
            margin: 0,
            opacity: 0,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            transition: "opacity 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          DÀNH RIÊNG CHO NÀNG · OLIUS ROSE SOIRÉE
        </p>
      </div>

      {/* Drag & Scroll Prompt */}
      <div
        ref={promptRef}
        style={{
          position: "absolute",
          bottom: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
          zIndex: 20,
          pointerEvents: "none",
          opacity: 0,
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
          KÉO ĐỂ XOAY 360° · CUỘN ĐỂ CHUYỂN BỘ SƯU TẬP TÚI XÁCH
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
