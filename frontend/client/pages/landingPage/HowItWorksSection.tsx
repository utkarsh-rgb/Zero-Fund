import { Sparkles, Users, Rocket, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Sparkles,
      title: "Post or Browse Ideas",
      description:
        "Entrepreneurs post startup concepts with detailed requirements. Developers explore opportunities that align with their expertise and interests.",
    },
    {
      number: "02",
      icon: Users,
      title: "Collaborate & Contract",
      description:
        "Connect through our platform, discuss project scope, and generate legally binding agreements with transparent equity terms.",
    },
    {
      number: "03",
      icon: Rocket,
      title: "Build & Earn",
      description:
        "Track development progress, complete defined milestones, and accumulate equity ownership as you bring the vision to life.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0EA5E9 1px, transparent 0)`,
            backgroundSize: '3rem 3rem',
          }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Simple Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            How Zero Fund Venture Works
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A transparent, secure process designed to protect both entrepreneurs and developers at every step
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-200 h-full">
                  {/* Number Badge */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                    
                    {/* Connecting Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-12 lg:-right-14 top-1/2 -translate-y-1/2">
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                    <StepIcon className="w-7 h-7 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-center leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">
            Ready to start your journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.location.href = '/entrepreneur-signup'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold group"
            >
              <span>Post Your Idea</span>
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => window.location.href = '/developer-signup'}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold"
            >
              Browse Opportunities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}