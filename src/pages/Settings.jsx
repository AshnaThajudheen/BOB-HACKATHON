import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { validateSettings } from '../utils/validators';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, updateSettings, theme, toggleTheme } = useApp();
  const [formData, setFormData] = useState(settings);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateSettings(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateSettings(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(settings);
    setErrors({});
    toast.success('Settings reset');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 md:px-20 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
          <p className="text-gray-400 text-lg">
            Manage your preferences and API configuration
          </p>
        </motion.div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* API Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
              
              <div className="space-y-4">
                <Input
                  label="API Key"
                  type="password"
                  placeholder="Enter your API key"
                  value={formData.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  error={errors.apiKey}
                />

                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <p className="text-sm text-gray-400">
                    <strong>Note:</strong> Your API key is stored locally and never sent to our servers.
                    It's used only for authenticating with IBM watsonx services.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* User Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6">User Preferences</h2>
              
              <div className="space-y-4">
                <Input
                  label="Email (Optional)"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                />

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition">
                    <div>
                      <p className="font-medium">Enable Notifications</p>
                      <p className="text-sm text-gray-400">
                        Get notified when analysis is complete
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => handleChange('notifications', e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700 transition">
                    <div>
                      <p className="font-medium">Auto-Analyze</p>
                      <p className="text-sm text-gray-400">
                        Automatically start analysis after repository connection
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.autoAnalyze}
                      onChange={(e) => handleChange('autoAnalyze', e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700"
                    />
                  </label>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6">Appearance</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-gray-400">
                      Currently using {theme} mode
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                  </Button>
                </div>

                <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
                  <p className="text-sm text-yellow-400">
                    <strong>Coming Soon:</strong> Light mode is currently in development.
                    Stay tuned for updates!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6">Data Management</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <h3 className="font-semibold mb-2">Export Data</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Download all your repository analyses and settings as JSON
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const data = {
                        settings: formData,
                        exportDate: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'autodoctest-settings.json';
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Settings exported!');
                    }}
                  >
                    Export Settings
                  </Button>
                </div>

                <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl">
                  <h3 className="font-semibold mb-2 text-red-400">Clear All Data</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    This will delete all your repository analyses and reset settings
                  </p>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure? This action cannot be undone.')) {
                        localStorage.clear();
                        toast.success('All data cleared');
                        window.location.reload();
                      }
                    }}
                  >
                    Clear All Data
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              Save Changes
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </motion.div>
        </form>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-4">About BobCat</h2>
            <div className="space-y-2 text-gray-400">
              <p>Version: 1.0.0</p>
              <p>Powered by IBM watsonx and IBM Bob</p>
              <p className="pt-4 border-t border-gray-800">
                © 2026 BobCat. All rights reserved.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

// Made with Bob
