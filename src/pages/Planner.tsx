import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import Planner3D from "@/components/3DPlanner";
import Test3DPlanner from "@/components/3DPlannerTest";
import Simple3DPlanner from "@/components/3DPlannerSimple";
import Planner3DFixed from "@/components/3DPlannerFixed";
import { Layers, Zap, Save, Share2, Download } from "lucide-react";

const Planner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AIAssistant />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">3D House Planner</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Design and visualize your interior space in real-time 3D
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Real-time 3D
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Save className="h-3 w-3" />
                Save Designs
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                Share Projects
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                Export Images
              </Badge>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Interactive 3D Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Planner3DFixed />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See your design changes instantly in 3D with smooth interactions and realistic lighting
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Furniture Library</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from a variety of furniture pieces including sofas, tables, chairs, and more
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Save & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Save your designs locally and share your creative interior layouts with others
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Planner;
