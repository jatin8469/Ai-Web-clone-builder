import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Bell, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { currentUser } = useAuth();

  const settingsSections = [
    {
      title: 'Profile Information',
      icon: User,
      description: 'Update your personal details and how others see you.',
      fields: [
        { label: 'Email Address', value: currentUser?.email, disabled: true },
        { label: 'Display Name', value: currentUser?.displayName || 'User', disabled: false },
      ]
    },
    {
      title: 'Subscription',
      icon: CreditCard,
      description: 'Manage your plan and billing information.',
      content: (
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-indigo-400">Free Plan</p>
            <p className="text-sm text-slate-400">You are currently on the lifetime free plan.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Upgrade Pro
          </button>
        </div>
      )
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Password and authentication settings.',
      content: (
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
          Change Password
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        {settingsSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
                <section.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{section.title}</h3>
                <p className="text-sm text-slate-400">{section.description}</p>
              </div>
            </div>

            {section.fields ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {section.fields.map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      disabled={field.disabled}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            ) : (
              section.content
            )}

            {section.title === 'Profile Information' && (
              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-white text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
