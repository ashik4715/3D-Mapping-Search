import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { QueryNode, SceneData } from '../types/scene';

const DEFAULT_WIDTH = 120;
const DEFAULT_DEPTH = 60;

interface Props {
  data?: SceneData;
  highlightTopic?: string;
  onHover?: (query: QueryNode | null) => void;
}

interface QueryMesh {
  mesh: THREE.Mesh;
  node: QueryNode;
  baseColor: THREE.Color;
}

const identifier = (node: QueryNode) => `${node.timestamp}-${node.query}`;

const topicColor = (idx: number) => {
  const color = new THREE.Color();
  color.setHSL((idx * 0.16) % 1, 0.6, 0.55);
  return color;
};

export function SearchTerrainScene({ data, highlightTopic, onHover }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dataGroupRef = useRef<THREE.Group | null>(null);
  const queryMeshesRef = useRef<QueryMesh[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2(2, 2));
  const hoveredIdRef = useRef<string | null>(null);
  const highlightRef = useRef<string | undefined>(undefined);
  const animationRef = useRef<number | null>(null);

  const updateQueryVisuals = useCallback(() => {
    queryMeshesRef.current.forEach(({ mesh, node, baseColor }) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) {
        return;
      }
      const isTopicMatch = !highlightRef.current || node.topic === highlightRef.current;
      const isHovered = hoveredIdRef.current === identifier(node);
      mat.color.copy(baseColor);
      mat.emissive.setHex(isHovered ? 0x4da3ff : 0x000000);
      mat.opacity = isTopicMatch ? 0.95 : 0.2;
      mat.transparent = mat.opacity < 1;
      const scale = isHovered ? 1.4 : 1;
      mesh.scale.set(scale, scale, scale);
    });
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05060d');

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1500,
    );
    camera.position.set(80, 60, 80);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.set(0, 10, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(50, 80, 30);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(200, 20, 0x16213f, 0x0d1324);
    scene.add(grid);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const applySize = () => {
      const container = mountRef.current;
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const { width, height } = getCanvasSize(container);
      rendererRef.current.setSize(width, height, false);
      rendererRef.current.domElement.style.width = `${width}px`;
      rendererRef.current.domElement.style.height = `${height}px`;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    applySize();

    const handlePointerMove = (event: MouseEvent) => {
      if (!rendererRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    let resizeObserver: ResizeObserver | null = null;
    let fallbackResizeListener = false;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => applySize());
      resizeObserver.observe(mount);
    } else {
      window.addEventListener('resize', applySize);
      fallbackResizeListener = true;
    }
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      controls.update();
      highlightInteractions(onHover);
      renderer.render(scene, camera);
    };

    const highlightInteractions = (hoverCallback?: (q: QueryNode | null) => void) => {
      if (!cameraRef.current || !dataGroupRef.current) return;
      const intersectables = queryMeshesRef.current.map(({ mesh }) => mesh);
      if (!intersectables.length) return;

      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const hits = raycasterRef.current.intersectObjects(intersectables, false);
      const hitNode = hits.length ? (hits[0].object.userData?.node as QueryNode | undefined) : undefined;
      const newId = hitNode ? identifier(hitNode) : null;
      if (newId !== hoveredIdRef.current) {
        hoveredIdRef.current = newId;
        updateQueryVisuals();
        hoverCallback?.(hitNode ?? null);
      }
    };

    animate();

    return () => {
      resizeObserver?.disconnect();
      if (fallbackResizeListener) {
        window.removeEventListener('resize', applySize);
      }
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [onHover, updateQueryVisuals]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (dataGroupRef.current) {
      scene.remove(dataGroupRef.current);
      dataGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).geometry) {
          (child as THREE.Mesh).geometry.dispose();
        }
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose());
          } else {
            mat.dispose();
          }
        }
      });
    }

    queryMeshesRef.current = [];
    dataGroupRef.current = null;

    if (!data) {
      return;
    }

    const group = new THREE.Group();
    scene.add(group);
    dataGroupRef.current = group;

    const terrain = buildTerrainMesh(data);
    group.add(terrain);

    const queryGroup = new THREE.Group();
    group.add(queryGroup);

    const topicColors = new Map<string, THREE.Color>();
    data.metadata.topics.forEach((topic, idx) => {
      topicColors.set(topic.topic, topicColor(idx));
    });

    const xExtent = data.queries.reduce(
      (acc, q) => {
        return {
          min: Math.min(acc.min, q.position[0]),
          max: Math.max(acc.max, q.position[0]),
        };
      },
      { min: 0, max: DEFAULT_WIDTH },
    );
    const zExtent = data.queries.reduce(
      (acc, q) => {
        return {
          min: Math.min(acc.min, q.position[2]),
          max: Math.max(acc.max, q.position[2]),
        };
      },
      { min: 0, max: DEFAULT_DEPTH },
    );

    const xCenter = (xExtent.max + xExtent.min) / 2;
    const zCenter = (zExtent.max + zExtent.min) / 2;

    const sphere = new THREE.SphereGeometry(1, 16, 16);

    data.queries.forEach((node) => {
      const baseColor =
        topicColors.get(node.topic) ??
        new THREE.Color(`hsl(${Math.random() * 360}, 70%, 55%)`);
      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness: 0.1,
        roughness: 0.4,
      });

      const marker = new THREE.Mesh(sphere, material);
      marker.position.set(
        node.position[0] - xCenter,
        node.position[1] + 1.5,
        node.position[2] - zCenter,
      );
      marker.userData = { node };
      queryGroup.add(marker);
      queryMeshesRef.current.push({ mesh: marker, node, baseColor });
    });

    highlightRef.current = highlightTopic;
    hoveredIdRef.current = null;
    updateQueryVisuals();
  }, [data, highlightTopic, updateQueryVisuals]);

  useEffect(() => {
    highlightRef.current = highlightTopic;
    updateQueryVisuals();
  }, [highlightTopic, updateQueryVisuals]);

  return <div className="three-wrapper" ref={mountRef} />;
}

export default SearchTerrainScene;

function buildTerrainMesh(data: SceneData): THREE.Mesh {
  const profile = data.terrainProfile;
  const width = profile.at(-1)?.x ?? DEFAULT_WIDTH;

  const zValues = data.queries.map((q) => q.position[2]);
  const zMin = zValues.length ? Math.min(...zValues) : 0;
  const zMax = zValues.length ? Math.max(...zValues) : DEFAULT_DEPTH;
  const depth = Math.max(20, zMax - zMin || DEFAULT_DEPTH);
  const zCenter = (zMax + zMin) / 2;

  const segmentsX = Math.max(1, profile.length - 1);
  const segmentsZ = Math.max(1, data.metadata.topics.length - 1);

  const geometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
  geometry.rotateX(-Math.PI / 2);

  const heightAt = (ratio: number) => {
    if (!profile.length) return 0;
    const targetX = ratio * width;
    if (targetX <= profile[0].x) return profile[0].height;
    for (let i = 0; i < profile.length - 1; i++) {
      const current = profile[i];
      const next = profile[i + 1];
      if (targetX >= current.x && targetX <= next.x) {
        const segmentRatio = (targetX - current.x) / Math.max(next.x - current.x, 1e-6);
        return THREE.MathUtils.lerp(current.height, next.height, segmentRatio);
      }
    }
    return profile.at(-1)?.height ?? 0;
  };

  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) + width / 2;
    const normalizedX = THREE.MathUtils.clamp(x / width, 0, 1);
    const height = heightAt(normalizedX);
    position.setY(i, height);
    const z = position.getZ(i);
    position.setZ(i, z - (zCenter - depth / 2));
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x1f3b73,
    transparent: true,
    opacity: 0.85,
    metalness: 0.05,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  return mesh;
}

function getCanvasSize(container: HTMLElement): { width: number; height: number } {
  const maxWidth = 1100;
  const minWidth = 320;
  const desiredWidth = Math.min(maxWidth, Math.max(minWidth, container.clientWidth));
  const minHeight = 420;
  const maxHeight = 660;
  const responsiveHeight = desiredWidth * 0.55;
  const desiredHeight = Math.min(maxHeight, Math.max(minHeight, responsiveHeight));
  return { width: desiredWidth, height: desiredHeight };
}

