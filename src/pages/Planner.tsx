import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { Layers } from "lucide-react";

const Planner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AIAssistant />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">3D House Planner</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Visualize and plan your interior design in 3D
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                3D Planning Tool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <Layers className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our advanced 3D planning tool is currently under development. 
                    Soon you'll be able to design your space in real-time with drag-and-drop furniture placement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See your design changes instantly in 3D
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Product Library</h3>
                <p className="text-sm text-muted-foreground">
                  Access our full catalog in the planner
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Save & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Save designs and share with others
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
