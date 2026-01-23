
import IndexHeader from "./IndexHeader";
import IndexHero from "./IndexHero";
import IndexTrust from "./IndexTrust";
import IndexFooter from "./IndexFooter";
import HowItWorksSection from "./HowItWorksSection";
import { Users, Sparkles, Rocket } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white scroll-smooth">
      {/* Header */}
      <IndexHeader />

      {/* Hero Section */}

      <IndexHero />

      {/* How it Works Section */}
      <HowItWorksSection/>

      <IndexTrust />
<IndexFooter/>
    </div>
  );
}
