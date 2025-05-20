'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {  FaLock, FaUser, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import LogoIcon from "@/src/LogoIcon";
import Typography from "@/src/components/Typography";
import GradientButton from "@/src/components/GradientButton";
import { useAuthStore } from "@/src/store/authStore";
import apiClient from "@/src/services/apiClient";
import { User } from "@/src/types";

const menuItems = [
  { name: "Profile", icon: <FaUser />, key: "profile" },
  { name: "Security", icon: <FaLock />, key: "security" },
  // { name: "General", icon: <FaCog />, key: "general" },
];

export default function Settings() {
  const [selected, setSelected] = useState("profile");
  const router = useRouter();
  const { user } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Function to render the appropriate content based on selected menu item
  const renderContent = () => {
    switch (selected) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "general":
        return <GeneralSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <LogoIcon width={24} height={24} color="white" />
              </div>
              <div>
                <Typography variant="h1" className="text-xl font-bold">Velutara</Typography>
                <Typography variant="body2" className="text-gray-500">Your travel AI assistant</Typography>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex p-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-64 bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer text-gray-700 transition hover:bg-gray-200 ${
                  selected === item.key ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelected(item.key)}
              >
                {item.icon} {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 ml-6">
          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 Velutara. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              {/* <Link href="/support" className="text-sm text-gray-500 hover:text-gray-900">
                Support
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Only proceed if we have changes
      if (formData.name === user?.name && formData.email === user?.email) {
        setSuccess("No changes to save");
        setLoading(false);
        return;
      }
      
      // Determine which fields to update
      const updateData: Record<string, string> = {};
      if (formData.name !== user?.name) updateData.name = formData.name;
      if (formData.email !== user?.email) updateData.email = formData.email;
      
      const response = await apiClient.put<{ user : User}>('/api/profile/update', updateData);
      
      // Update the user in the store
      if (response && response.user) {
        updateUser(response.user);
      }
      
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Enter your email address"
          />
        </div>
        
        <div className="pt-4 flex justify-end">
          <GradientButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </GradientButton>
        </div>
      </form>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  const [passwordMode, setPasswordMode] = useState("change"); // "change" or "forgot"
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
      
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setPasswordMode("change")}
          className={`px-4 py-2 rounded-md transition-colors ${
            passwordMode === "change" 
              ? "bg-purple-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Change Password
        </button>
        <button
          onClick={() => setPasswordMode("forgot")}
          className={`px-4 py-2 rounded-md transition-colors ${
            passwordMode === "forgot" 
              ? "bg-purple-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Forgot Password
        </button>
      </div>
      
      {passwordMode === "change" ? <ChangePasswordForm /> : <ForgotPasswordForm />}
    </div>
  );
}

// Change Password Form
function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation
      if (formData.newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords do not match");
      }
      
      // API call to change password
      await apiClient.post('/api/profile/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setSuccess("Password changed successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Password must be at least 8 characters
        </p>
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>
      
      <div className="pt-4 flex justify-end">
        <GradientButton
          type="submit"
          disabled={loading}
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </GradientButton>
      </div>
    </form>
  );
}

// Forgot Password Form
function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // API call to request a password reset
      await apiClient.post('/api/password-reset/request', { email });
      
      setResetRequested(true);
      setSuccess("If a user with that email exists, a password reset link has been sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };
  
  if (resetRequested) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaEnvelope size={24} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
        <p className="text-gray-600 mb-6">
          If we found an account associated with {email}, we&apos;ve sent instructions to reset your password.
        </p>
        <p className="text-sm text-gray-500">
          Didn&apos;t receive an email? Check your spam folder or try again.
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <p className="text-gray-600 mb-4">
        Enter your email address below, and we&apos;ll send you a link to reset your password.
      </p>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>
      
      <div className="pt-4 flex justify-end">
        <GradientButton
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </GradientButton>
      </div>
    </form>
  );
}

// General Settings Component
function GeneralSettings() {

  

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings (would normally call an API here)
    alert('Settings saved!');
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-6">General Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <div>
          <h4 className="text-lg font-semibold mb-3">Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="emailNotifications" 
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="marketingEmails" 
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                Marketing emails
              </label>
            </div>
          </div>
        </div> */}

        <div className="pt-4 flex justify-end">
          <GradientButton type="submit">
            Save Settings
          </GradientButton>
        </div>
      </form>
    </div>
  );
}