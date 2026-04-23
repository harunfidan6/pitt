import dagre from 'dagre';
import { Node, Edge, MarkerType } from '@xyflow/react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const generateLayoutedElements = () => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const addNode = (id: string, label: string, type: string = 'customDev', metaCategory: string = 'general') => {
    nodes.push({
      id,
      data: { label, metaCategory },
      position: { x: 0, y: 0 },
      type,
    });
  };

  const addEdge = (source: string, target: string, animated = false) => {
    edges.push({
      id: `e-${source}-${target}`,
      source,
      target,
      animated,
      style: { 
        stroke: animated ? '#FFB81C' : '#666', 
        strokeWidth: animated ? 2 : 1.5,
        opacity: animated ? 1 : 0.6
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: animated ? '#FFB81C' : '#666',
      },
    });
  };

  // --- 1. ROOT ---
  addNode('root', 'THE PITT 24/7\nMASTER PIPELINE', 'root', 'root');

  // --- 2. CATEGORIES (PHASE GATES) ---
  const branches = [
    { id: 'cat_pre', label: 'PHASE 1: PRE-PROD' },
    { id: 'cat_core', label: 'PHASE 2: UNITY CORE & ENV' },
    { id: 'cat_med', label: 'PHASE 3: MEDICAL SIM' },
    { id: 'cat_npc', label: 'PHASE 4: AI & LIFE SIM' },
  ];

  branches.forEach(b => addNode(b.id, b.label, 'category', 'category'));

  // Connect root to first phase
  addEdge('root', 'cat_pre', true);
  addEdge('cat_pre', 'cat_core', true);
  addEdge('cat_core', 'cat_med', true);
  addEdge('cat_med', 'cat_npc', true);

  // --- PHASE 1: PRE-PROD CHAIN ---
  const preNodes = ['GDD Revizyonu', 'Referans Toplanması', 'Renk Paletleri', 'Hastane Mimari Kat Planı'];
  preNodes.forEach((n, i) => addNode(`pre_${i}`, n, 'customDev', 'design'));
  
  addEdge('cat_pre', 'pre_0', true);
  addEdge('pre_0', 'pre_1');
  addEdge('pre_1', 'pre_2');
  addEdge('pre_2', 'pre_3', true);
  
  // Pipeline Split
  addNode('pre_split_env', 'Mimari Blok Planları (Blender)', 'customDev', 'blender');
  addNode('pre_split_sys', 'UML Sistem Analizi (Unity)', 'customDev', 'unity');
  addEdge('pre_3', 'pre_split_env', true);
  addEdge('pre_3', 'pre_split_sys', true);

  // --- PHASE 2: CORE & ENV CHAIN ---
  // Environment Block
  addNode('env_0', '0.22m Duvar S.', 'customDev', 'blender');
  addNode('env_1', '2.15m Kapı S.', 'customDev', 'blender');
  addNode('env_2', 'Epoksi Zemin', 'customDev', 'blender');
  addNode('env_3', 'Trauma Tower Model', 'customDev', 'blender');
  addNode('env_4', 'Tıbbi Aletler Prop Paketi', 'customDev', 'blender');
  
  addEdge('pre_split_env', 'cat_core', true);
  addEdge('cat_core', 'env_0');
  addEdge('env_0', 'env_1');
  addEdge('env_1', 'env_2');
  addEdge('env_2', 'env_3');
  addEdge('env_3', 'env_4', true);

  // Unity Block
  addNode('core_0', 'Proje Kurulumu (New Input)', 'customDev', 'unity');
  addNode('core_1', 'FPS / İzometrik Kamera', 'customDev', 'unity');
  addNode('core_2', '24 Saat Döngüsü (TimeManager)', 'customDev', 'unity');
  addNode('core_3', 'Game State & Save Sistemi', 'customDev', 'unity');
  
  addEdge('pre_split_sys', 'cat_core', true);
  addEdge('cat_core', 'core_0');
  addEdge('core_0', 'core_1');
  addEdge('core_1', 'core_2');
  addEdge('core_2', 'core_3', true);

  // Merge Env and Core
  addNode('core_merge', 'Ortamın Motora Entegrasyonu', 'customDev', 'general');
  addEdge('env_4', 'core_merge', true);
  addEdge('core_3', 'core_merge', true);

  // --- PHASE 3: MEDICAL SIM CHAIN ---
  addEdge('core_merge', 'cat_med', true);
  
  addNode('med_0', 'Triyaj Sistemi (Kırmızı/Sarı/Yeşil)', 'customDev', 'medical');
  addNode('med_1', 'Vital Bulgu Matematik Motoru', 'customDev', 'medical');
  addNode('med_2', 'Kan Basıncı & Satürasyon', 'customDev', 'medical');
  addNode('med_3', 'Ambulans Spawner', 'customDev', 'medical');
  
  addEdge('cat_med', 'med_0', true);
  addEdge('med_0', 'med_1');
  addEdge('med_1', 'med_2');
  addEdge('med_2', 'med_3', true);

  // Minigame Splits
  addNode('mg_airway', 'Entübasyon Minigame', 'customDev', 'medical');
  addNode('mg_cpr', 'CPR / Kalp Masajı', 'customDev', 'medical');
  addNode('mg_iv', 'Damar Yolu (IV) Açma', 'customDev', 'medical');
  
  addEdge('med_3', 'mg_airway', true);
  addEdge('med_3', 'mg_cpr', true);
  addEdge('med_3', 'mg_iv', true);

  addNode('med_merge', 'ATLS Protokol Testi', 'customDev', 'general');
  addEdge('mg_airway', 'med_merge', true);
  addEdge('mg_cpr', 'med_merge', true);
  addEdge('mg_iv', 'med_merge', true);

  // --- PHASE 4: NPC & CIVILIAN CHAIN ---
  addEdge('med_merge', 'cat_npc', true);

  addNode('npc_0', 'NavMesh & Pathfinding', 'customDev', 'unity');
  addNode('npc_1', 'Hemşire Görev Algoritması', 'customDev', 'unity');
  addNode('npc_2', 'Tükenmişlik (Burnout) Mekaniği', 'customDev', 'general');
  
  addEdge('cat_npc', 'npc_0', true);
  addEdge('npc_0', 'npc_1');
  addEdge('npc_1', 'npc_2', true);

  addNode('civ_0', 'Eve Dönüş Yükleme Ekranı', 'customDev', 'unity');
  addNode('civ_1', 'Uyku ve Enerji Yönetimi', 'customDev', 'general');
  addNode('civ_2', 'Kariyer Sınavına Çalışma', 'customDev', 'general');
  
  addEdge('npc_2', 'civ_0', true);
  addEdge('civ_0', 'civ_1');
  addEdge('civ_1', 'civ_2', true);

  // --- FINAL ---
  addNode('final', 'BETA ALPHA 1.0', 'root', 'root');
  addEdge('civ_2', 'final', true);


  // DAGRE LAYOUT CALCULATION
  dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 60, ranksep: 220 });

  nodes.forEach((node) => {
    let width = 240;
    let height = 80;
    if(node.type === 'root') { width = 340; height = 100; }
    if(node.type === 'category') { width = 260; height = 70; }
    
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
