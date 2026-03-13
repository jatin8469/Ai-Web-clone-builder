import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Bell, Save, Loader2, ExternalLink, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Settings() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await updateProfile(currentUser, { displayName });
      setModalMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setModalMessage(`Password reset email sent to ${currentUser.email}! Please check your inbox.`);
    } catch (error) {
      console.error('Error sending password reset:', error);
      setModalMessage('Failed to send password reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleUpgrade = () => {
    setModalMessage("Pro subscription integration coming soon! (Stripe integration required)");
  };

  const settingsSections = [
    {
      title: 'Profile Information',
      icon: User,
      description: 'Update your personal details and how others see you.',
      isProfile: true
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
          <button 
            onClick={handleUpgrade}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <span>Upgrade Pro</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Password and authentication settings.',
      content: (
        <button 
          onClick={handlePasswordReset}
          disabled={isResetting}
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
          <span>{isResetting ? 'Sending Email...' : 'Send Password Reset Email'}</span>
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

            {section.isProfile ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={currentUser?.email || ''}
                    disabled={true}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            ) : section.fields ? (
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
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-white text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-4 mt-2">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Notice</h3>
            <p className="text-slate-400 text-center mb-6">
              {modalMessage}
            </p>
            <button 
              onClick={() => setModalMessage('')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
