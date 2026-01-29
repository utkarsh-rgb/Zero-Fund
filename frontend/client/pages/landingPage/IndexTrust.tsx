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
    },
  ];

  return (
    <section id="trust" className="relative py-20 md:py-28 bg-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4">
            Built on Trust
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
              >
                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
                    <FeatureIcon className="w-7 h-7 text-black" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-black mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">100%</div>
            <div className="text-sm text-gray-600">Contract Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">24/7</div>
            <div className="text-sm text-gray-600">Security Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">SOC 2</div>
            <div className="text-sm text-gray-600">Compliance Certified</div>
          </div>
        </div>
      </div>
    </section>
  );
}