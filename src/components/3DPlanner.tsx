import React, { useState, useRef, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Text, Html } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  RotateCcw, 
  Save, 
  Download, 
  Eye, 
  EyeOff, 
  Plus, 
  Minus,
  Move,
  RotateCw,
  Trash2,
  Share2,
  Copy,
  Palette,
  Settings,
  Grid3X3,
  Camera,
  Upload
} from 'lucide-react';

interface FurnitureItem {
  id: string;
  type: 'sofa' | 'table' | 'chair' | 'lamp' | 'bed' | 'shelf' | 'tv' | 'plant' | 'bookshelf' | 'dining_table';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
  price?: number;
  description?: string;
  isDragging?: boolean;
}

interface DesignProject {
  id: string;
  name: string;
  furniture: FurnitureItem[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

const FurnitureObject: React.FC<{ 
  item: FurnitureItem; 
  onUpdate: (item: FurnitureItem) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ item, onUpdate, isSelected, onSelect }) => {
  const meshRef = useRef<any>();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...item.position);
      meshRef.current.rotation.set(...item.rotation);
      meshRef.current.scale.set(...item.scale);
    }
  });

  const getGeometry = () => {
    switch (item.type) {
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
        return <Cylinder args={[0.3, 0.3, 1.2]} />;
      case 'bookshelf':
        return <Box args={[0.3, 2, 0.8]} />;
      case 'dining_table':
        return <Box args={[1.5, 0.05, 1]} />;
      default:
        return <Box args={[1, 1, 1]} />;
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(item.id);
  };

  const handlePointerOver = () => setIsHovered(true);
  const handlePointerOut = () => setIsHovered(false);

  return (
    <group>
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {getGeometry()}
        <meshStandardMaterial 
          color={item.color} 
          transparent
          opacity={isSelected ? 0.8 : isHovered ? 0.9 : 1}
        />
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

const Room: React.FC<{ showGrid: boolean }> = ({ showGrid }) => {
  return (
    <group>
      {/* Floor */}
      <Box args={[10, 0.1, 10]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Box>
      
      {/* Grid */}
      {showGrid && (
        <group>
          {Array.from({ length: 21 }, (_, i) => (
            <group key={i}>
              <Box args={[10, 0.01, 0.01]} position={[0, 0.01, -5 + i * 0.5]}>
                <meshStandardMaterial color="#cccccc" transparent opacity={0.3} />
              </Box>
              <Box args={[0.01, 0.01, 10]} position={[-5 + i * 0.5, 0.01, 0]}>
                <meshStandardMaterial color="#cccccc" transparent opacity={0.3} />
              </Box>
            </group>
          ))}
        </group>
      )}
      
      {/* Walls */}
      <Box args={[10, 3, 0.1]} position={[0, 1.5, -5]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[10, 3, 0.1]} position={[0, 1.5, 5]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[0.1, 3, 10]} position={[-5, 1.5, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[0.1, 3, 10]} position={[5, 1.5, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
    </group>
  );
};

const Planner3D: React.FC = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [cameraView, setCameraView] = useState<'perspective' | 'top'>('perspective');
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [currentProject, setCurrentProject] = useState<DesignProject | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projectName, setProjectName] = useState('');

  const addFurniture = (type: FurnitureItem['type']) => {
    const newItem: FurnitureItem = {
      id: `${type}-${Date.now()}`,
      type,
      position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: getDefaultColor(type),
      name: getDefaultName(type),
      price: getDefaultPrice(type),
      description: getDefaultDescription(type),
    };
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);
  };

  const getDefaultColor = (type: FurnitureItem['type']): string => {
    const colors = {
      sofa: '#8B4513',
      table: '#D2691E',
      chair: '#CD853F',
      lamp: '#FFD700',
      bed: '#4169E1',
      shelf: '#A0522D',
      tv: '#2C2C2C',
      plant: '#228B22',
      bookshelf: '#8B4513',
      dining_table: '#D2691E',
    };
    return colors[type];
  };

  const getDefaultName = (type: FurnitureItem['type']): string => {
    const names = {
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
    return names[type];
  };

  const getDefaultPrice = (type: FurnitureItem['type']): number => {
    const prices = {
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
    return prices[type];
  };

  const getDefaultDescription = (type: FurnitureItem['type']): string => {
    const descriptions = {
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
    return descriptions[type];
  };

  const updateFurniture = (updatedItem: FurnitureItem) => {
    setFurniture(furniture.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const deleteFurniture = (id: string) => {
    setFurniture(furniture.filter(item => item.id !== id));
    if (selectedItem === id) {
      setSelectedItem(null);
    }
    toast.success('Item deleted successfully');
  };

  const resetRoom = () => {
    setFurniture([]);
    setSelectedItem(null);
    toast.success('Room reset successfully');
  };

  const saveProject = () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const project: DesignProject = {
      id: `project-${Date.now()}`,
      name: projectName,
      furniture,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('designProjects', JSON.stringify(updatedProjects));
    setCurrentProject(project);
    setShowProjectDialog(false);
    setProjectName('');
    toast.success('Project saved successfully!');
  };

  const loadProject = (project: DesignProject) => {
    setFurniture(project.furniture);
    setCurrentProject(project);
    setSelectedItem(null);
    toast.success(`Loaded project: ${project.name}`);
  };

  const shareProject = () => {
    if (!currentProject) {
      toast.error('No project to share');
      return;
    }

    const shareData = {
      project: currentProject,
      timestamp: new Date().toISOString(),
    };

    const shareUrl = `${window.location.origin}/planner?shared=${encodeURIComponent(JSON.stringify(shareData))}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Share link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy share link');
    });
  };

  const exportImage = () => {
    // This would typically capture the canvas and download as image
    toast.success('Image export feature coming soon!');
  };

  const loadSavedProjects = () => {
    const saved = localStorage.getItem('designProjects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  };

  React.useEffect(() => {
    loadSavedProjects();
  }, []);

  const selectedFurniture = furniture.find(item => item.id === selectedItem);

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[700px]">
      {/* Controls Panel */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto">
        {/* Project Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                  <Button onClick={saveProject} className="w-full">
                    Save Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={shareProject}
              disabled={!currentProject}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Project
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={exportImage}
            >
              <Camera className="h-4 w-4 mr-2" />
              Export Image
            </Button>
          </CardContent>
        </Card>

        {/* Furniture Library */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Furniture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(['sofa', 'table', 'chair', 'lamp', 'bed', 'shelf', 'tv', 'plant', 'bookshelf', 'dining_table'] as const).map((type) => (
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
            ))}
          </CardContent>
        </Card>

        {/* View Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
                <Label>Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={selectedFurniture.color}
                    onChange={(e) => updateFurniture({...selectedFurniture, color: e.target.value})}
                    className="w-8 h-8 rounded border"
                  />
                  <Input
                    value={selectedFurniture.color}
                    onChange={(e) => updateFurniture({...selectedFurniture, color: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Position X: {selectedFurniture.position[0].toFixed(1)}</Label>
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
                <Label>Position Z: {selectedFurniture.position[2].toFixed(1)}</Label>
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

              <div>
                <Label>Rotation Y: {selectedFurniture.rotation[1].toFixed(1)}°</Label>
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

        {/* Saved Projects */}
        {projects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-2 rounded border cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => loadProject(project)}
                >
                  <div className="font-medium text-sm">{project.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()} • {project.furniture.length} items
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Room showGrid={showGrid} />
                {furniture.map((item) => (
                  <FurnitureObject
                    key={item.id}
                    item={item}
                    onUpdate={updateFurniture}
                    isSelected={selectedItem === item.id}
                    onSelect={setSelectedItem}
                  />
                ))}
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Suspense>
            </Canvas>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planner3D;
