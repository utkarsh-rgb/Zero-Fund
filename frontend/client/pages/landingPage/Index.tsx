import IndexHeader from "./IndexHeader";
import IndexHero from "./IndexHero";
import IndexTrust from "./IndexTrust";
import IndexFooter from "./IndexFooter";
import HowItWorksSection from "./HowItWorksSection";
import BlackFooter from "./BlackFooter.jsx"

export default function Index() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Header */}
      <IndexHeader />

      {/* Hero Section */}
      <IndexHero />

      {/* How it Works Section */}
      <HowItWorksSection />

      {/* Trust Section */}
      <IndexTrust />

      {/* Footer */}
      <IndexFooter />
      <BlackFooter/>
    </div>
  );
}