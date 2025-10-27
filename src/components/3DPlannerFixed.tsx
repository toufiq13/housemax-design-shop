import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html, Plane } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RotateCcw, 
  Save, 
  Plus, 
  Trash2,
  Settings,
  Grid3X3,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Ruler,
  Home,
  Layers,
  Paintbrush,
  Sun
} from 'lucide-react';

interface FurnitureItem {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
  price: number;
  description: string;
  material: string;
  texture: string;
}

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

interface RoomColors {
  walls: string;
  floor: string;
  ceiling: string;
}

interface ViewMode {
  type: 'edit' | 'view';
  perspective: 'first-person' | 'third-person' | 'top-down';
  fullscreen: boolean;
}

interface RooftopEnvironment {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'clear-night';
  windIntensity: number;
}

// Furniture Object Component
const FurnitureObject: React.FC<{
  item: FurnitureItem;
  onUpdate: (item: FurnitureItem) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ item, onUpdate, isSelected, onSelect }) => {
  const groupRef = useRef<any>();
  const [isHovered, setIsHovered] = useState(false);
  
  // Furniture stays in place - no auto-rotation
  // Position can be adjusted using the position sliders in Item Properties panel

  const materialProps = {
    color: item.color,
    transparent: true,
    opacity: isSelected ? 0.85 : isHovered ? 0.9 : 1
  };

  const getGeometry = () => {
    switch (item.type) {
      // Indoor furniture
      case 'sofa':
        return <Box args={[2, 0.5, 0.8]} />;
      case 'table':
        return <Box args={[1.2, 0.05, 0.8]} />;
      case 'chair':
        return <Box args={[0.5, 0.8, 0.5]} />;
      case 'lamp':
        return <Cylinder args={[0.1, 0.1, 1.5]} />;
      case 'bed':
        return <Box args={[2, 0.3, 1.5]} />;
      case 'shelf':
        return <Box args={[0.2, 1.5, 0.8]} />;
      case 'tv':
        return <Box args={[1.5, 0.1, 0.9]} />;
      case 'plant':
        return <Cylinder args={[0.3, 0.3, 2]} />;
      case 'bookshelf':
        return <Box args={[1.5, 0.05, 1]} />;
      case 'dining_table':
        return <Box args={[1, 1, 1]} />;
      
      // Rooftop furniture
      case 'outdoor-sofa':
        return <Box args={[2, 0.5, 0.8]} />;
      case 'outdoor-table':
        return <Box args={[1.2, 0.05, 0.8]} />;
      case 'outdoor-chair':
        return <Box args={[0.5, 0.8, 0.5]} />;
      case 'umbrella':
        return <Cylinder args={[0.1, 0.1, 2.5]} />;
      case 'fire-pit':
        return <Cylinder args={[0.8, 0.8, 0.3]} />;
      case 'outdoor-plant':
        return <Cylinder args={[0.4, 0.4, 1.5]} />;
      case 'string-lights':
        return <Box args={[3, 0.05, 0.05]} />;
      case 'outdoor-lamp':
        return <Cylinder args={[0.15, 0.15, 2]} />;
      case 'garden-bed':
        return <Box args={[2, 0.3, 1]} />;
      case 'water-feature':
        return <Cylinder args={[1, 1, 0.5]} />;
      case 'grill':
        return <Box args={[1, 0.8, 0.6]} />;
      case 'hammock':
        return <Box args={[2, 0.1, 0.1]} />;
      
      // New rooftop items - simplified to single shapes for proper color support
      case 'ceiling-fan':
        return <Cylinder args={[1, 1, 0.1]} />;
      case 'led-lights':
        return <Box args={[0.5, 0.05, 0.05]} />;
      case 'fixed-pop-roof':
        return <Box args={[3, 0.2, 3]} />;
      case 'solar-panel':
        return <Box args={[1.5, 0.05, 1]} />;
      case 'rooftop-garden':
        return <Box args={[2, 0.2, 1.5]} />;
      case 'outdoor-speaker':
        return <Cylinder args={[0.2, 0.2, 0.3]} />;
      case 'weather-station':
        return <Cylinder args={[0.2, 0.2, 1]} />;
      
      default:
        return <Box args={[1, 1, 1]} />;
    }
  };

  const geometry = getGeometry();

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {geometry}
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {isSelected && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-medium shadow-lg">
            {item.name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Room Component
const Room: React.FC<{ 
  showGrid: boolean; 
  dimensions: RoomDimensions; 
  colors: RoomColors;
  showCeiling: boolean;
  workspaceMode: 'indoor' | 'rooftop';
  rooftopEnvironment: RooftopEnvironment;
}> = ({ showGrid, dimensions, colors, showCeiling, workspaceMode, rooftopEnvironment }) => {
  const { length, width, height } = dimensions;
  
  return (
    <group>
      {/* Floor/Rooftop Surface */}
      <Box args={[length, 0.1, width]} position={[0, -0.05, 0]}>
        <meshStandardMaterial 
          color={workspaceMode === 'rooftop' ? '#87CEEB' : colors.floor} 
          roughness={workspaceMode === 'rooftop' ? 0.8 : 0.3}
        />
      </Box>
      
      {/* Grid */}
      {showGrid && (
        <group>
          {Array.from({ length: Math.floor(length * 2) + 1 }, (_, i) => (
            <group key={`x-${i}`}>
              <Box 
                args={[length, 0.01, 0.01]} 
                position={[0, 0.01, -width/2 + i * 0.5]}
              >
                <meshStandardMaterial 
                  color={workspaceMode === 'rooftop' ? '#87CEEB' : '#cccccc'} 
                  transparent 
                  opacity={workspaceMode === 'rooftop' ? 0.5 : 0.3} 
                />
              </Box>
            </group>
          ))}
          {Array.from({ length: Math.floor(width * 2) + 1 }, (_, i) => (
            <group key={`z-${i}`}>
              <Box 
                args={[0.01, 0.01, width]} 
                position={[-length/2 + i * 0.5, 0.01, 0]}
              >
                <meshStandardMaterial 
                  color={workspaceMode === 'rooftop' ? '#87CEEB' : '#cccccc'} 
                  transparent 
                  opacity={workspaceMode === 'rooftop' ? 0.5 : 0.3} 
                />
              </Box>
            </group>
          ))}
        </group>
      )}
      
      {/* Walls (only for indoor mode) */}
      {workspaceMode === 'indoor' && (
        <>
          <Box args={[length, height, 0.1]} position={[0, height/2, -width/2]}>
            <meshStandardMaterial color={colors.walls} />
          </Box>
          <Box args={[length, height, 0.1]} position={[0, height/2, width/2]}>
            <meshStandardMaterial color={colors.walls} />
          </Box>
          <Box args={[0.1, height, width]} position={[-length/2, height/2, 0]}>
            <meshStandardMaterial color={colors.walls} />
          </Box>
          <Box args={[0.1, height, width]} position={[length/2, height/2, 0]}>
            <meshStandardMaterial color={colors.walls} />
          </Box>
        </>
      )}

      {/* Rooftop Railings */}
      {workspaceMode === 'rooftop' && (
        <>
          <Box args={[length, 1, 0.1]} position={[0, 0.5, -width/2]}>
            <meshStandardMaterial color="#C0C0C0" />
          </Box>
          <Box args={[length, 1, 0.1]} position={[0, 0.5, width/2]}>
            <meshStandardMaterial color="#C0C0C0" />
          </Box>
          <Box args={[0.1, 1, width]} position={[-length/2, 0.5, 0]}>
            <meshStandardMaterial color="#C0C0C0" />
          </Box>
          <Box args={[0.1, 1, width]} position={[length/2, 0.5, 0]}>
            <meshStandardMaterial color="#C0C0C0" />
          </Box>
        </>
      )}
      
      {/* Ceiling (only for indoor mode) */}
      {showCeiling && workspaceMode === 'indoor' && (
        <Box args={[length, 0.1, width]} position={[0, height, 0]}>
          <meshStandardMaterial color={colors.ceiling} />
        </Box>
      )}

      {/* Sky for rooftop mode */}
      {workspaceMode === 'rooftop' && (
        <RooftopEnvironment 
          timeOfDay={rooftopEnvironment.timeOfDay}
          weather={rooftopEnvironment.weather}
          windIntensity={rooftopEnvironment.windIntensity}
        />
      )}
    </group>
  );
};

// Rooftop Environment Component
const RooftopEnvironment: React.FC<{
  timeOfDay: string;
  weather: string;
  windIntensity: number;
}> = ({ timeOfDay, weather, windIntensity }) => {
  const getSkyColor = () => {
    if (timeOfDay === 'night') return '#191970';
    if (timeOfDay === 'evening') return '#FF6347';
    if (timeOfDay === 'morning') return '#87CEEB';
    return '#87CEEB'; // afternoon
  };

  const getAmbientIntensity = () => {
    if (timeOfDay === 'night') return 0.1;
    if (timeOfDay === 'evening') return 0.3;
    if (timeOfDay === 'morning') return 0.6;
    return 1.0; // afternoon
  };

  return (
    <group>
      {/* Sky Sphere */}
      <Sphere args={[50, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color={getSkyColor()} 
          side={2} // DoubleSide
        />
      </Sphere>
      
      {/* Ambient Light */}
      <ambientLight intensity={getAmbientIntensity()} />
      
      {/* Directional Light (Sun) */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={timeOfDay === 'night' ? 0.1 : 1.0}
        color={timeOfDay === 'evening' ? '#FF6347' : '#FFFFFF'}
      />
      
      {/* Weather Effects */}
      {weather === 'rainy' && (
        <group>
          {Array.from({ length: 100 }, (_, i) => (
            <Box 
              key={i} 
              args={[0.01, 0.5, 0.01]} 
              position={[
                (Math.random() - 0.5) * 20, 
                Math.random() * 10 + 5, 
                (Math.random() - 0.5) * 20
              ]}
            >
              <meshBasicMaterial color="#87CEEB" transparent opacity={0.6} />
            </Box>
          ))}
        </group>
      )}
      
      {/* Wind Effect on Plants */}
      {windIntensity > 0.3 && (
        <group>
          {/* Simulate wind effect with moving particles */}
          {Array.from({ length: 20 }, (_, i) => (
            <Box 
              key={`wind-${i}`} 
              args={[0.05, 0.05, 0.05]} 
              position={[
                (Math.random() - 0.5) * 20, 
                Math.random() * 2, 
                (Math.random() - 0.5) * 20
              ]}
            >
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
};

const Planner3DFixed: React.FC = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({
    length: 10,
    width: 10,
    height: 3
  });
  const [roomColors, setRoomColors] = useState<RoomColors>({
    walls: '#e0e0e0',
    floor: '#f5f5f5',
    ceiling: '#ffffff'
  });
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: 'edit',
    perspective: 'third-person',
    fullscreen: false
  });
  const [showCeiling, setShowCeiling] = useState(false);
  const [activeTab, setActiveTab] = useState('furniture');
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([5, 5, 5]);
  const [workspaceMode, setWorkspaceMode] = useState<'indoor' | 'rooftop'>('indoor');
  const [rooftopEnvironment, setRooftopEnvironment] = useState<RooftopEnvironment>({
    timeOfDay: 'afternoon',
    weather: 'sunny',
    windIntensity: 0.5
  });

  // Handle workspace mode switching
  const handleWorkspaceModeChange = (mode: 'indoor' | 'rooftop') => {
    setWorkspaceMode(mode);
    // Clear furniture when switching modes (optional - user might want to keep some items)
    // setFurniture([]);
    // setSelectedItem(null);
  };

  const addFurniture = (type: string) => {
    const isRooftopType = type.startsWith('outdoor-') || ['umbrella', 'fire-pit', 'string-lights', 'garden-bed', 'water-feature', 'grill', 'hammock', 'ceiling-fan', 'led-lights', 'fixed-pop-roof', 'solar-panel', 'rooftop-garden', 'outdoor-speaker', 'weather-station'].includes(type);
    
    // Special positioning for ceiling items
    const isCeilingItem = ['ceiling-fan', 'led-lights'].includes(type);
    const isFixedStructure = ['fixed-pop-roof', 'solar-panel'].includes(type);
    
    // In rooftop mode, items should be placed on the rooftop surface (y = 0.1 to be on top of the floor)
    const baseY = workspaceMode === 'rooftop' ? 0.1 : 0;
    
    const newItem: FurnitureItem = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position: isCeilingItem 
        ? [Math.random() * 4 - 2, roomDimensions.height - 0.5, Math.random() * 4 - 2] // Ceiling level
        : isFixedStructure 
        ? [0, baseY + 0.1, 0] // Center position for fixed structures, slightly above ground
        : [Math.random() * 4 - 2, baseY, Math.random() * 4 - 2], // Ground/rooftop level
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: isRooftopType ? getRooftopColor(type) : getDefaultColor(type),
      name: isRooftopType ? getRooftopName(type) : getDefaultName(type),
      price: isRooftopType ? getRooftopPrice(type) : getDefaultPrice(type),
      description: isRooftopType ? `${getRooftopName(type)} - Perfect for outdoor spaces` : getDefaultDescription(type),
      material: isRooftopType ? 'weather-resistant' : 'wood',
      texture: isRooftopType ? 'outdoor' : 'smooth'
    };
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);
  };

  const getDefaultColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      sofa: '#8B4513',
      table: '#D2691E',
      chair: '#8B4513',
      lamp: '#FFD700',
      bed: '#F5F5DC',
      shelf: '#8B4513',
      tv: '#000000',
      plant: '#228B22',
      bookshelf: '#8B4513',
      dining_table: '#D2691E',
    };
    return colors[type] || '#8B4513';
  };

  const getDefaultName = (type: string): string => {
    const names: { [key: string]: string } = {
      sofa: 'Modern Sofa',
      table: 'Coffee Table',
      chair: 'Dining Chair',
      lamp: 'Floor Lamp',
      bed: 'Queen Bed',
      shelf: 'Storage Shelf',
      tv: 'Smart TV',
      plant: 'Decorative Plant',
      bookshelf: 'Book Shelf',
      dining_table: 'Dining Table',
    };
    return names[type] || type;
  };

  const getDefaultPrice = (type: string): number => {
    const prices: { [key: string]: number } = {
      sofa: 899,
      table: 299,
      chair: 149,
      lamp: 199,
      bed: 1299,
      shelf: 399,
      tv: 1299,
      plant: 49,
      bookshelf: 599,
      dining_table: 799,
    };
    return prices[type] || 0;
  };

  const getDefaultDescription = (type: string): string => {
    const descriptions: { [key: string]: string } = {
      sofa: 'Comfortable modern sofa perfect for living rooms',
      table: 'Stylish coffee table with storage space',
      chair: 'Ergonomic dining chair with premium materials',
      lamp: 'Adjustable floor lamp with LED lighting',
      bed: 'Queen size bed with premium mattress',
      shelf: 'Multi-purpose storage shelf unit',
      tv: '55" Smart TV with 4K resolution',
      plant: 'Low-maintenance decorative plant',
      bookshelf: 'Tall bookshelf with multiple compartments',
      dining_table: 'Solid wood dining table for 6 people',
    };
    return descriptions[type] || `${type} - High quality furniture`;
  };

  // Rooftop-specific helper functions
  const getRooftopName = (type: string): string => {
    const names: { [key: string]: string } = {
      'outdoor-sofa': 'Outdoor Sectional',
      'outdoor-table': 'Patio Table',
      'outdoor-chair': 'Outdoor Chair',
      'umbrella': 'Patio Umbrella',
      'fire-pit': 'Fire Pit',
      'outdoor-plant': 'Garden Plant',
      'string-lights': 'String Lights',
      'outdoor-lamp': 'Outdoor Lamp',
      'garden-bed': 'Garden Bed',
      'water-feature': 'Water Feature',
      'grill': 'BBQ Grill',
      'hammock': 'Hammock',
      'ceiling-fan': 'Ceiling Fan',
      'led-lights': 'LED Strip Lights',
      'fixed-pop-roof': 'Fixed Pop Roof',
      'solar-panel': 'Solar Panel',
      'rooftop-garden': 'Rooftop Garden',
      'outdoor-speaker': 'Outdoor Speaker',
      'weather-station': 'Weather Station',
    };
    return names[type] || type;
  };

  const getRooftopPrice = (type: string): number => {
    const prices: { [key: string]: number } = {
      'outdoor-sofa': 1299,
      'outdoor-table': 599,
      'outdoor-chair': 199,
      'umbrella': 299,
      'fire-pit': 799,
      'outdoor-plant': 89,
      'string-lights': 49,
      'outdoor-lamp': 299,
      'garden-bed': 199,
      'water-feature': 899,
      'grill': 699,
      'hammock': 399,
      'ceiling-fan': 599,
      'led-lights': 199,
      'fixed-pop-roof': 2999,
      'solar-panel': 899,
      'rooftop-garden': 499,
      'outdoor-speaker': 399,
      'weather-station': 299,
    };
    return prices[type] || 0;
  };

  const getRooftopColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'outdoor-sofa': '#8B4513',
      'outdoor-table': '#D2691E',
      'outdoor-chair': '#8B4513',
      'umbrella': '#FF6347',
      'fire-pit': '#FF4500',
      'outdoor-plant': '#228B22',
      'string-lights': '#FFD700',
      'outdoor-lamp': '#C0C0C0',
      'garden-bed': '#8B4513',
      'water-feature': '#87CEEB',
      'grill': '#696969',
      'hammock': '#8B4513',
      'ceiling-fan': '#C0C0C0',
      'led-lights': '#FFFFFF',
      'fixed-pop-roof': '#708090',
      'solar-panel': '#2F4F4F',
      'rooftop-garden': '#228B22',
      'outdoor-speaker': '#000000',
      'weather-station': '#4682B4',
    };
    return colors[type] || '#8B4513';
  };

  const updateFurniture = (updatedItem: FurnitureItem) => {
    setFurniture(furniture.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const deleteFurniture = (id: string) => {
    setFurniture(furniture.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  const resetRoom = () => {
    setFurniture([]);
    setSelectedItem(null);
  };

  const handleViewModeChange = (mode: 'edit' | 'view') => {
    setViewMode(prev => ({ ...prev, type: mode }));
    if (mode === 'view') {
      setCameraPosition([0, 1.6, 0]); // First person view
    } else {
      setCameraPosition([5, 5, 5]); // Third person view
    }
  };

  const handleCameraNavigation = (direction: 'left' | 'right' | 'up' | 'down') => {
    const step = 0.5;
    setCameraPosition(prev => {
      const [x, y, z] = prev;
      switch (direction) {
        case 'left': return [x - step, y, z];
        case 'right': return [x + step, y, z];
        case 'up': return [x, y + step, z];
        case 'down': return [x, y - step, z];
        default: return prev;
      }
    });
  };

  const selectedFurniture = furniture.find(item => item.id === selectedItem);

  return (
    <div className={`${viewMode.fullscreen ? 'fixed inset-0 z-50 bg-background' : 'grid lg:grid-cols-4 gap-6 h-[700px]'}`}>
      {/* Controls Panel */}
      {viewMode.type === 'edit' && (
        <div className={`${viewMode.fullscreen ? 'fixed left-4 top-4 w-80 z-10' : 'lg:col-span-1'} space-y-4 overflow-y-auto max-h-screen`}>
          {/* Main Controls */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="furniture" className="text-xs">
                <Home className="h-3 w-3 mr-1" />
                Furniture
              </TabsTrigger>
              <TabsTrigger value="room" className="text-xs">
                <Layers className="h-3 w-3 mr-1" />
                Room
              </TabsTrigger>
              <TabsTrigger value="colors" className="text-xs">
                <Paintbrush className="h-3 w-3 mr-1" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="view" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                View
              </TabsTrigger>
            </TabsList>

            {/* Workspace Mode Toggle */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Workspace Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={workspaceMode === 'indoor' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleWorkspaceModeChange('indoor')}
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Indoor
                  </Button>
                  <Button
                    variant={workspaceMode === 'rooftop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleWorkspaceModeChange('rooftop')}
                    className="flex-1"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Rooftop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Furniture Tab */}
            <TabsContent value="furniture" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Furniture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {workspaceMode === 'indoor' ? 
                    (['sofa', 'table', 'chair', 'lamp', 'bed', 'shelf', 'tv', 'plant', 'bookshelf', 'dining_table'] as const).map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => addFurniture(type)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {getDefaultName(type)}
                        <Badge variant="secondary" className="ml-auto text-xs">
                          ${getDefaultPrice(type)}
                        </Badge>
                      </Button>
                    )) :
                    (['outdoor-sofa', 'outdoor-table', 'outdoor-chair', 'umbrella', 'fire-pit', 'outdoor-plant', 'string-lights', 'outdoor-lamp', 'garden-bed', 'water-feature', 'grill', 'hammock', 'ceiling-fan', 'led-lights', 'fixed-pop-roof', 'solar-panel', 'rooftop-garden', 'outdoor-speaker', 'weather-station'] as const).map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => addFurniture(type)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {getRooftopName(type)}
                        <Badge variant="secondary" className="ml-auto text-xs">
                          ${getRooftopPrice(type)}
                        </Badge>
                      </Button>
                    ))
                  }
                </CardContent>
              </Card>
            </TabsContent>

            {/* Room Tab */}
            <TabsContent value="room" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    {workspaceMode === 'rooftop' ? 'Rooftop Dimensions' : 'Room Dimensions'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Length: {roomDimensions.length}m</Label>
                    <Slider
                      value={[roomDimensions.length]}
                      onValueChange={([value]) => setRoomDimensions(prev => ({ ...prev, length: value }))}
                      min={5}
                      max={20}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Width: {roomDimensions.width}m</Label>
                    <Slider
                      value={[roomDimensions.width]}
                      onValueChange={([value]) => setRoomDimensions(prev => ({ ...prev, width: value }))}
                      min={5}
                      max={20}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Height: {roomDimensions.height}m</Label>
                    <Slider
                      value={[roomDimensions.height]}
                      onValueChange={([value]) => setRoomDimensions(prev => ({ ...prev, height: value }))}
                      min={2}
                      max={5}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                  {workspaceMode === 'indoor' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showCeiling"
                        checked={showCeiling}
                        onChange={(e) => setShowCeiling(e.target.checked)}
                      />
                      <Label htmlFor="showCeiling">Show Ceiling</Label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rooftop Environment Controls */}
              {workspaceMode === 'rooftop' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Environment Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Time of Day</Label>
                      <Select
                        value={rooftopEnvironment.timeOfDay}
                        onValueChange={(value) => setRooftopEnvironment(prev => ({ ...prev, timeOfDay: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Weather</Label>
                      <Select
                        value={rooftopEnvironment.weather}
                        onValueChange={(value) => setRooftopEnvironment(prev => ({ ...prev, weather: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunny">Sunny</SelectItem>
                          <SelectItem value="cloudy">Cloudy</SelectItem>
                          <SelectItem value="rainy">Rainy</SelectItem>
                          <SelectItem value="clear-night">Clear Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Wind Intensity: {rooftopEnvironment.windIntensity}</Label>
                      <Slider
                        value={[rooftopEnvironment.windIntensity]}
                        onValueChange={([value]) => setRooftopEnvironment(prev => ({ ...prev, windIntensity: value }))}
                        min={0}
                        max={1}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              {workspaceMode === 'indoor' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Paintbrush className="h-4 w-4" />
                      Room Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Walls</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={roomColors.walls}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, walls: e.target.value }))}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={roomColors.walls}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, walls: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Floor</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={roomColors.floor}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, floor: e.target.value }))}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={roomColors.floor}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, floor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Ceiling</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={roomColors.ceiling}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, ceiling: e.target.value }))}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={roomColors.ceiling}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, ceiling: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Paintbrush className="h-4 w-4" />
                      Rooftop Surface
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Surface Color (Sky/Days)</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="color"
                          value={roomColors.floor}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, floor: e.target.value }))}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={roomColors.floor}
                          onChange={(e) => setRoomColors(prev => ({ ...prev, floor: e.target.value }))}
                          className="flex-1"
                          placeholder="#87CEEB"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💡 Tip: Rooftop mode uses a sky environment. The environment lighting and time of day affect the appearance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* View Tab */}
            <TabsContent value="view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    View Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode.type === 'edit' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleViewModeChange('edit')}
                      className="flex-1"
                    >
                      Edit Mode
                    </Button>
                    <Button
                      variant={viewMode.type === 'view' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleViewModeChange('view')}
                      className="flex-1"
                    >
                      View Mode
                    </Button>
                  </div>
                  <div>
                    <Label>Perspective</Label>
                    <Select 
                      value={viewMode.perspective} 
                      onValueChange={(value) => setViewMode(prev => ({ ...prev, perspective: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-person">First Person</SelectItem>
                        <SelectItem value="third-person">Third Person</SelectItem>
                        <SelectItem value="top-down">Top Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    {showGrid ? 'Hide' : 'Show'} Grid
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={resetRoom}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Room
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Item Properties */}
          {selectedFurniture && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Item Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={selectedFurniture.name}
                    onChange={(e) => updateFurniture({...selectedFurniture, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label className="text-base font-semibold mb-2 block">🎨 Furniture Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={selectedFurniture.color}
                      onChange={(e) => updateFurniture({...selectedFurniture, color: e.target.value})}
                      className="w-12 h-12 rounded border-2 border-border cursor-pointer"
                      title="Choose custom color"
                    />
                    <Input
                      value={selectedFurniture.color}
                      onChange={(e) => updateFurniture({...selectedFurniture, color: e.target.value})}
                      className="flex-1"
                      placeholder="Hex color code"
                    />
                  </div>
                  
                  {/* Quick Color Presets */}
                  <div className="mt-3">
                    <Label className="text-sm font-medium mb-2 block">Popular Color Presets</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        ['#8B4513', 'Brown Wood'],
                        ['#D2691E', 'Chocolate'],
                        ['#FF6347', 'Tomato'],
                        ['#228B22', 'Forest Green'],
                        ['#87CEEB', 'Sky Blue'],
                        ['#C0C0C0', 'Silver'],
                        ['#FFD700', 'Gold'],
                        ['#696969', 'Dim Gray'],
                        ['#000000', 'Black'],
                        ['#FFFFFF', 'White'],
                        ['#FF4500', 'Orange Red'],
                        ['#708090', 'Slate Gray'],
                        ['#FF1493', 'Deep Pink'],
                        ['#00CED1', 'Dark Turquoise'],
                        ['#FF69B4', 'Hot Pink'],
                        ['#FFB6C1', 'Light Pink'],
                        ['#E6E6FA', 'Lavender'],
                        ['#F5DEB3', 'Wheat'],
                      ].map(([color, name]) => (
                        <div key={color} className="flex flex-col items-center gap-1">
                          <button
                            className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 hover:shadow-md ${
                              selectedFurniture.color === color ? 'border-primary ring-2 ring-primary' : 'border-gray-300 hover:border-primary'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateFurniture({...selectedFurniture, color})}
                            title={name}
                          />
                          <span className="text-xs text-muted-foreground text-center line-clamp-1">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Color Preview */}
                  <div className="mt-3 p-2 rounded border bg-muted/50">
                    <Label className="text-xs text-muted-foreground">Current Selection:</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-6 h-6 rounded border-2 border-border" 
                        style={{ backgroundColor: selectedFurniture.color }}
                      />
                      <span className="text-sm font-medium">{selectedFurniture.color}</span>
                    </div>
                  </div>
                </div>

                {/* Position Controls */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">📍 Position</Label>
                  <div className="space-y-3">
                    <div>
                      <Label>X Position: {selectedFurniture.position[0].toFixed(1)}</Label>
                      <Slider
                        value={[selectedFurniture.position[0]]}
                        onValueChange={([value]) => updateFurniture({
                          ...selectedFurniture,
                          position: [value, selectedFurniture.position[1], selectedFurniture.position[2]]
                        })}
                        min={-5}
                        max={5}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Z Position: {selectedFurniture.position[2].toFixed(1)}</Label>
                      <Slider
                        value={[selectedFurniture.position[2]]}
                        onValueChange={([value]) => updateFurniture({
                          ...selectedFurniture,
                          position: [selectedFurniture.position[0], selectedFurniture.position[1], value]
                        })}
                        min={-5}
                        max={5}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation Control */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">🔄 Rotation</Label>
                  <div>
                    <Label>Y Rotation: {selectedFurniture.rotation[1].toFixed(1)}°</Label>
                    <Slider
                      value={[selectedFurniture.rotation[1] * (180 / Math.PI)]}
                      onValueChange={([value]) => updateFurniture({
                        ...selectedFurniture,
                        rotation: [selectedFurniture.rotation[0], value * (Math.PI / 180), selectedFurniture.rotation[2]]
                      })}
                      min={0}
                      max={360}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Material Selection */}
                <div>
                  <Label>Material</Label>
                  <Select
                    value={selectedFurniture.material}
                    onValueChange={(value) => updateFurniture({...selectedFurniture, material: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="fabric">Fabric</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                      <SelectItem value="stone">Stone</SelectItem>
                      <SelectItem value="weather-resistant">Weather Resistant</SelectItem>
                      <SelectItem value="leather">Leather</SelectItem>
                      <SelectItem value="ceramic">Ceramic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Texture Selection */}
                <div>
                  <Label>Texture</Label>
                  <Select
                    value={selectedFurniture.texture}
                    onValueChange={(value) => updateFurniture({...selectedFurniture, texture: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smooth">Smooth</SelectItem>
                      <SelectItem value="rough">Rough</SelectItem>
                      <SelectItem value="glossy">Glossy</SelectItem>
                      <SelectItem value="matte">Matte</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="textured">Textured</SelectItem>
                      <SelectItem value="fabric">Fabric</SelectItem>
                      <SelectItem value="wood-grain">Wood Grain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => deleteFurniture(selectedFurniture.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Placed Items */}
          {furniture.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Placed Items ({furniture.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {furniture.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedItem === item.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        ${item.price}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 3D Canvas */}
      <div className={`${viewMode.fullscreen ? 'fixed inset-0' : 'lg:col-span-3'}`}>
        <Card className="h-full">
          <CardContent className="p-0 h-full relative">
            {/* View Mode Navigation Controls */}
            {viewMode.type === 'view' && (
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCameraNavigation('up')}
                  className="w-10 h-10 p-0"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCameraNavigation('left')}
                    className="w-10 h-10 p-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCameraNavigation('right')}
                    className="w-10 h-10 p-0"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCameraNavigation('down')}
                  className="w-10 h-10 p-0"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewModeChange('edit')}
                  className="w-10 h-10 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Canvas 
              camera={{ 
                position: cameraPosition, 
                fov: viewMode.perspective === 'first-person' ? 75 : 50 
              }}
            >
              <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D scene...</div>}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Room 
                  showGrid={showGrid} 
                  dimensions={roomDimensions}
                  colors={roomColors}
                  showCeiling={showCeiling}
                  workspaceMode={workspaceMode}
                  rooftopEnvironment={rooftopEnvironment}
                />
                {furniture.map((item) => (
                  <FurnitureObject
                    key={item.id}
                    item={item}
                    onUpdate={updateFurniture}
                    isSelected={selectedItem === item.id}
                    onSelect={setSelectedItem}
                  />
                ))}
                <OrbitControls 
                  enablePan={viewMode.type === 'edit'} 
                  enableZoom={true} 
                  enableRotate={viewMode.type === 'edit'}
                  enabled={viewMode.type === 'edit'}
                />
              </Suspense>
            </Canvas>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planner3DFixed;
