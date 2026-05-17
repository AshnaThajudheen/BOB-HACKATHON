import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Test Generation',
      description:
        'Automatically generate unit tests, integration tests, and edge-case scenarios for repositories.',
    },
    {
      title: 'API Documentation',
      description:
        'Generate Swagger/OpenAPI documentation with request and response examples.',
    },
    {
      title: 'Code Explanation Engine',
      description:
        'Explain functions, classes, and modules in human-readable language.',
    },
    {
      title: 'Repository Intelligence',
      description:
        'Analyze project structure, dependencies, and module relationships.',
    },
  ];

  const generatedDocs = [
    'Authentication API Documentation',
    'User Service Unit Tests',
    'Database Layer Explanation',
    'Frontend Routing Summary',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-16 border-b border-gray-800">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-block px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-sm mb-6">
              IBM watsonx + IBM Bob Powered
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              BobCat
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              AI-Powered Repository Intelligence for Automated Documentation & Testing
            </p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/dashboard')}>
                Connect Repository
              </Button>

              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-950 border border-gray-800 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Repository Analysis</h2>
              <span className="text-green-400 text-sm">AI Active</span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex justify-between mb-2">
                  <span>Repository Scan</span>
                  <span className="text-green-400">Completed</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="bg-white h-2 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
                >
                  <p className="text-gray-400 text-sm">Generated Tests</p>
                  <h3 className="text-3xl font-bold mt-2">142</h3>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
                >
                  <p className="text-gray-400 text-sm">API Endpoints</p>
                  <h3 className="text-3xl font-bold mt-2">38</h3>
                </motion.div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <h3 className="font-semibold mb-4">Generated Outputs</h3>

                <div className="space-y-3">
                  {generatedDocs.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="flex items-center justify-between bg-black rounded-xl p-3 border border-gray-800"
                    >
                      <span>{doc}</span>
                      <button className="text-sm px-3 py-1 rounded-lg bg-white text-black hover:scale-105 transition">
                        Open
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Intelligent Developer Automation
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transform repositories into fully documented, test-ready,
              developer-friendly projects using AI.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-950 border border-gray-800 rounded-3xl p-6 hover:border-white transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-xl mb-5">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflow */}
      <section className="px-6 md:px-20 py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">
              Simple AI-powered workflow for repository understanding.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-6"
          >
            {[
              'Connect GitHub Repository',
              'AI Scans Source Code',
              'Generate Tests & Docs',
              'Download & Deploy',
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-950 border border-gray-800 rounded-3xl p-8 text-center"
              >
                <div className="text-5xl font-bold text-gray-700 mb-4">
                  0{index + 1}
                </div>

                <h3 className="text-lg font-semibold">{step}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gray-950 border border-gray-800 rounded-[40px] p-12 text-center"
        >
          <h2 className="text-5xl font-bold mb-6">
            Build Better Software Faster
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Generate documentation, tests, and repository insights instantly
            using IBM watsonx and IBM Bob.
          </p>

          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Launch Platform
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;

// Made with Bob
