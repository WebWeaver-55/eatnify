import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Menu, TrendingUp, Globe, MessageSquare, BarChart3, Sparkles, Star, Zap } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Intelligent customer service that answers questions and takes orders automatically.",
    iconBg: "bg-gradient-to-br from-blue-500/30 to-cyan-500/20",
    iconColor: "text-blue-400",
    benefits: ["24/7 availability", "Instant responses", "Order processing"],
    accent: "from-blue-500/20 to-cyan-500/10"
  },
  {
    icon: Menu,
    title: "Smart Menu Generator", 
    description: "Create beautiful, responsive digital menus with AI-powered recommendations.",
    iconBg: "bg-gradient-to-br from-emerald-500/30 to-teal-500/20",
    iconColor: "text-emerald-400",
    benefits: ["Responsive design", "AI recommendations", "Easy updates"],
    accent: "from-emerald-500/20 to-teal-500/10"
  },
  {
    icon: TrendingUp,
    title: "Marketing Campaigns",
    description: "Automated marketing campaigns to boost customer engagement and sales.",
    iconBg: "bg-gradient-to-br from-purple-500/30 to-violet-500/20",
    iconColor: "text-purple-400",
    benefits: ["Automated campaigns", "Targeted promotions", "ROI tracking"],
    accent: "from-purple-500/20 to-violet-500/10"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Detailed analytics to understand customer behavior and optimize your menu.",
    iconBg: "bg-gradient-to-br from-orange-500/30 to-amber-500/20", 
    iconColor: "text-orange-400",
    benefits: ["Real-time data", "Customer insights", "Performance metrics"],
    accent: "from-orange-500/20 to-amber-500/10"
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description: "Professional custom domain for your restaurant's digital presence.",
    iconBg: "bg-gradient-to-br from-indigo-500/30 to-blue-500/20",
    iconColor: "text-indigo-400",
    benefits: ["Professional branding", "SEO optimization", "Custom URLs"],
    accent: "from-indigo-500/20 to-blue-500/10"
  },
  {
    icon: MessageSquare,
    title: "Customer Engagement",
    description: "Interactive features to keep customers engaged and coming back.",
    iconBg: "bg-gradient-to-br from-rose-500/30 to-pink-500/20",
    iconColor: "text-rose-400", 
    benefits: ["Interactive features", "Loyalty programs", "Feedback system"],
    accent: "from-rose-500/20 to-pink-500/10"
  },
]

const stats = [
  { number: "500+", label: "Happy Restaurants", icon: Star },
  { number: "50K+", label: "Orders Processed", icon: TrendingUp },
  { number: "99.9%", label: "Uptime", icon: Zap },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/10 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-400/20 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Powerful Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Everything Your Restaurant
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Needs to Succeed</span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform your restaurant with our comprehensive suite of AI-powered tools designed 
            to enhance customer experience and boost your revenue.
          </p>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={index}
                className="group relative text-center p-6 rounded-2xl bg-gray-800/20 backdrop-blur-xl border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/20 mb-4 shadow-lg">
                  <StatIcon className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <Card
                key={index}
                className="group relative bg-gray-800/20 backdrop-blur-xl border border-gray-700/30 hover:border-blue-400/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Card glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}></div>
                
                <CardHeader className="pb-3 p-5 relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <FeatureIcon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-white text-lg font-bold group-hover:text-blue-100 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-5 pt-0 relative">
                  <CardDescription className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 shadow-sm"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced QR Code Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            See It In Action
          </h3>
          <p className="text-gray-400 text-lg">
            Experience the future of restaurant ordering
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-center">
          <div className="group relative bg-gray-800/20 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner relative">
              <div className="w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-xl flex items-center justify-center shadow-xl">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 ${i % 3 === 0 || i % 5 === 0 ? 'bg-black' : 'bg-white'} rounded-sm`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 font-medium relative">
              Scan to view menu
            </p>
          </div>

          <div className="text-center lg:text-left max-w-md">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-400/20 shadow-lg">
              <Zap className="w-4 h-4" />
              Instant Access
            </div>
            <h4 className="text-xl font-bold text-white mb-4">
              No App Required
            </h4>
            <p className="text-gray-400 leading-relaxed mb-6">
              Customers simply scan the QR code to access your digital menu instantly. 
              Works on any smartphone browser with lightning-fast loading times.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 shadow-sm"></div>
                <span className="text-sm text-gray-400">Works on all devices</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 shadow-sm"></div>
                <span className="text-sm text-gray-400">Loads in under 2 seconds</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 shadow-sm"></div>
                <span className="text-sm text-gray-400">No downloads needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}