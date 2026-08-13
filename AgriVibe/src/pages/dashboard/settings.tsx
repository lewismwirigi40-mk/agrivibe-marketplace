import DashboardLayout from '../../components/DashboardLayout';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    darkMode: true,
    twoFactorAuth: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Notifications */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🔔 Notifications</h2>
          <div className="space-y-3">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'smsNotifications', label: 'SMS Notifications' },
              { key: 'pushNotifications', label: 'Push Notifications' },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <span className="text-gray-300">{item.label}</span>
                <button
                  onClick={() => toggleSetting(item.key as keyof typeof settings)}
                  className={`w-12 h-6 rounded-full transition ${
                    settings[item.key as keyof typeof settings]
                      ? 'bg-yellow-400'
                      : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition transform ${
                      settings[item.key as keyof typeof settings]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🔒 Security</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Two-Factor Authentication</span>
              <button
                onClick={() => toggleSetting('twoFactorAuth')}
                className={`w-12 h-6 rounded-full transition ${
                  settings.twoFactorAuth ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <button className="text-yellow-400 hover:text-yellow-300 text-sm transition">
              Change Password →
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">⚠️ Account</h2>
          <button className="text-red-400 hover:text-red-300 text-sm transition">
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}