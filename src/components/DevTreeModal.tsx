import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Handle, Position, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { generateLayoutedElements } from '../lib/diagramData';
import { Target, Activity, Component, Boxes, MonitorPlay } from 'lucide-react';

const RootNode = ({ data }: any) => (
  <div style={{
    background: 'repeating-linear-gradient(45deg, var(--pitt-yellow) 0px, var(--pitt-yellow) 10px, var(--pitt-black) 10px, var(--pitt-black) 20px)',
    padding: '4px',
    borderRadius: '4px',
    boxShadow: '0 0 25px rgba(255, 184, 28, 0.4)',
    width: '340px'
  }}>
    <div style={{ backgroundColor: 'var(--pitt-black)', color: 'var(--pitt-yellow)', padding: '20px', fontWeight: 900, fontSize: '20px', textAlign: 'center', fontFamily: 'var(--display)', letterSpacing: '4px' }}>
      {data.label}
    </div>
    <Handle type="target" position={Position.Left} style={{ background: 'var(--pitt-yellow)', border: 'none', width: '10px', height: '10px' }} />
    <Handle type="source" position={Position.Right} style={{ background: 'var(--pitt-yellow)', border: 'none', width: '10px', height: '10px' }} />
  </div>
);

const CategoryNode = ({ data }: any) => (
  <div style={{ 
    backgroundColor: 'rgba(42, 42, 48, 0.9)', 
    color: 'var(--cream)', 
    padding: '16px', 
    fontWeight: 700, 
    fontSize: '14px', 
    border: '1px solid var(--concrete)', 
    borderLeft: '6px solid var(--florasan)', 
    textAlign: 'center', 
    fontFamily: 'var(--display)',
    letterSpacing: '2px',
    width: '260px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: 'var(--florasan)', border: 'none' }} />
    {data.label}
    <Handle type="source" position={Position.Right} style={{ background: 'var(--florasan)', border: 'none' }} />
  </div>
);

const CustomDevNode = ({ data }: any) => {
  const getIcon = () => {
    switch (data.metaCategory) {
      case 'medical': return <Activity size={16} color="#e84040" />;
      case 'unity': return <Component size={16} color="#60ddb0" />;
      case 'blender': return <Boxes size={16} color="#ff9060" />;
      case 'design': return <Target size={16} color="#c88aff" />;
      default: return <MonitorPlay size={16} color="#888" />;
    }
  };

  const getBorderColor = () => {
    switch (data.metaCategory) {
      case 'medical': return 'var(--red-alert)';
      case 'unity': return 'var(--florasan)';
      case 'blender': return '#ff9060';
      case 'design': return '#c88aff';
      default: return 'var(--concrete)';
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, var(--epoxy-mid) 0%, var(--pitt-black) 100%)', 
      color: 'var(--cream)', 
      padding: '12px 16px', 
      fontSize: '11px', 
      border: '1px solid #333', 
      borderTop: `3px solid ${getBorderColor()}`,
      fontFamily: 'var(--mono)', 
      textTransform: 'uppercase',
      width: '240px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#666', border: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {getIcon()}
        <span style={{ color: '#888', fontSize: '9px', letterSpacing: '1px' }}>{data.metaCategory} MODULE</span>
      </div>
      <div style={{ fontFamily: 'var(--body)', fontSize: '13px', lineHeight: 1.4 }}>{data.label}</div>
      <Handle type="source" position={Position.Right} style={{ background: '#666', border: 'none' }} />
    </div>
  );
};

interface DevTreeModalProps {
  onClose: () => void;
}

export const DevTreeModal: React.FC<DevTreeModalProps> = ({ onClose }) => {
  const { nodes, edges } = useMemo(() => generateLayoutedElements(), []);
  const nodeTypes = useMemo(() => ({ root: RootNode, category: CategoryNode, customDev: CustomDevNode }), []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(20,20,22,0.98)', zIndex: 99999, display: 'flex', flexDirection: 'column',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ 
        padding: '16px 24px', background: 'var(--pitt-black)', borderBottom: '2px solid var(--pitt-yellow)', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10
      }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 900, color: 'var(--pitt-yellow)', fontSize: '20px', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity color="var(--pitt-yellow)" /> MASTER DEV TREE <span style={{ color: '#888', fontSize: '12px', letterSpacing: '1px' }}>[100+ NODES / DEPENDENCY MATRIX]</span>
        </div>
        <button onClick={onClose} style={{ 
          background: 'var(--red-alert)', color: 'white', border: 'none', padding: '8px 16px', 
          fontFamily: 'var(--display)', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          DİYAGRAMI KAPAT
        </button>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          nodeTypes={nodeTypes}
          fitView 
          minZoom={0.05}
          maxZoom={1.5}
        >
          <Background color="#3a3a3e" gap={24} size={2} variant={BackgroundVariant.Dots} />
          <Controls style={{ background: 'var(--epoxy-light)', border: '1px solid var(--concrete)' }} />
          <MiniMap 
            style={{ background: 'var(--pitt-black)', border: '1px solid var(--pitt-yellow)' }}
            nodeColor={(node) => {
              if (node.type === 'root') return '#FFB81C';
              if (node.type === 'category') return '#c8f0e8';
              return '#444';
            }}
            maskColor="rgba(0, 0, 0, 0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};
