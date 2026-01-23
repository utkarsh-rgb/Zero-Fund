import { Shield, Star, Lock, CheckCircle } from "lucide-react";

export default function IndexTrust() {
  const trustFeatures = [
    {
      icon: Shield,
      title: "Legal Protection",
      description:
        "Auto-generated smart contracts with comprehensive IP protection, clear equity terms, and built-in dispute resolution mechanisms.",
      highlights: [
        "Legally binding contracts",
        "IP ownership clarity",
        "Dispute mediation",
      ],
      color: "blue",
    },
    {
      icon: Star,
      title: "Verified Identity",
      description:
        "Multi-level verification including KYC compliance, portfolio validation, and skill assessment to ensure authentic, qualified participants.",
      highlights: [
        "KYC verification",
        "Portfolio review",
        "Skill validation",
      ],
      color: "emerald",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description:
        "Enterprise-grade security with end-to-end encryption, secure data storage, and regular security audits to protect sensitive information.",
      highlights: [
        "256-bit encryption",
        "Secure data storage",
        "Regular audits",
      ],
      color: "violet",
    },
  ];

  return (
    <section id="trust" className="relative py-20 md:py-28 bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #0EA5E9 1px, transparent 1px),
                             linear-gradient(to bottom, #0EA5E9 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
          }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Trust & Security</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Built on Trust
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our platform creates a secure ecosystem where innovation thrives, partnerships flourish, and every collaboration contributes to positive impact
          </p>
        </div>

        {/* Trust Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-200"
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-${feature.color}-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <FeatureIcon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats/Social Proof */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8 pt-16 border-t border-slate-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">100%</div>
            <div className="text-sm text-slate-600">Contract Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
            <div className="text-sm text-slate-600">Security Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">SOC 2</div>
            <div className="text-sm text-slate-600">Compliance Certified</div>
          </div>
        </div>
      </div>
    </section>
  );
}