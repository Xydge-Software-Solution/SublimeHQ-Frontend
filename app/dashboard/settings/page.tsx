"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Palette,
  Mail,
  Smartphone,
  DollarSign,
  ShoppingCart,
  Megaphone,
  Shield,
  Key,
  Clock,
  Globe,
  Sun,
  Moon,
  Monitor,
  Check,
  Loader2,
  Save,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { storage, type AppSettings } from "@/lib/storage";

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "GHS", label: "Ghanaian Cedi (₵)" },
  { value: "KES", label: "Kenyan Shilling (KSh)" },
  { value: "ZAR", label: "South African Rand (R)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
];

const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
  { value: "DD MMM YYYY", label: "DD MMM YYYY (31 Dec 2024)" },
];

const sessionTimeouts = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 480, label: "8 hours" },
  { value: 1440, label: "24 hours" },
];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "security" | "display">("notifications");

  // Notification settings
  const [emailNewOrder, setEmailNewOrder] = useState(true);
  const [emailPayoutComplete, setEmailPayoutComplete] = useState(true);
  const [emailLowStock, setEmailLowStock] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [pushNewOrder, setPushNewOrder] = useState(true);
  const [pushPayoutComplete, setPushPayoutComplete] = useState(false);
  const [pushLowStock, setPushLowStock] = useState(true);
  const [pushMarketing, setPushMarketing] = useState(false);

  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showProductCount, setShowProductCount] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [shareDataWithPartners, setShareDataWithPartners] = useState(false);

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  // Display settings
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [compactMode, setCompactMode] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  useEffect(() => {
    const loadSettings = () => {
      const settings = storage.getAppSettings();
      
      if (settings) {
        // Notification settings
        if (settings.notifications) {
          setEmailNewOrder(settings.notifications.emailNewOrder ?? true);
          setEmailPayoutComplete(settings.notifications.emailPayoutComplete ?? true);
          setEmailLowStock(settings.notifications.emailLowStock ?? true);
          setEmailMarketing(settings.notifications.emailMarketing ?? false);
          setPushNewOrder(settings.notifications.pushNewOrder ?? true);
          setPushPayoutComplete(settings.notifications.pushPayoutComplete ?? false);
          setPushLowStock(settings.notifications.pushLowStock ?? true);
          setPushMarketing(settings.notifications.pushMarketing ?? false);
        }

        // Privacy settings
        if (settings.privacy) {
          setPublicProfile(settings.privacy.publicProfile ?? true);
          setShowEarnings(settings.privacy.showEarnings ?? false);
          setShowProductCount(settings.privacy.showProductCount ?? true);
          setAllowAnalytics(settings.privacy.allowAnalytics ?? true);
          setShareDataWithPartners(settings.privacy.shareDataWithPartners ?? false);
        }

        // Security settings
        if (settings.security) {
          setTwoFactorEnabled(settings.security.twoFactorEnabled ?? false);
          setLoginNotifications(settings.security.loginNotifications ?? true);
          setSessionTimeout(settings.security.sessionTimeout ?? 60);
        }

        // Display settings
        if (settings.display) {
          setTheme(settings.display.theme ?? "system");
          setCompactMode(settings.display.compactMode ?? false);
          setCurrency(settings.display.currency ?? "USD");
          setDateFormat(settings.display.dateFormat ?? "MM/DD/YYYY");
        }
      }

      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    const appSettings: AppSettings = {
      notifications: {
        emailNewOrder,
        emailPayoutComplete,
        emailLowStock,
        emailMarketing,
        pushNewOrder,
        pushPayoutComplete,
        pushLowStock,
        pushMarketing,
      },
      privacy: {
        publicProfile,
        showEarnings,
        showProductCount,
        allowAnalytics,
        shareDataWithPartners,
      },
      security: {
        twoFactorEnabled,
        loginNotifications,
        sessionTimeout,
      },
      display: {
        theme,
        compactMode,
        currency,
        dateFormat,
      },
    };

    storage.updateAppSettings(appSettings);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handle2FAToggle = async () => {
    if (!twoFactorEnabled) {
      // Simulate 2FA setup flow
      const confirmed = confirm(
        "Enable two-factor authentication? You'll need to scan a QR code with your authenticator app."
      );
      if (confirmed) {
        setTwoFactorEnabled(true);
        storage.updateSecuritySettings({ twoFactorEnabled: true, loginNotifications, sessionTimeout });
      }
    } else {
      const confirmed = confirm(
        "Disable two-factor authentication? This will make your account less secure."
      );
      if (confirmed) {
        setTwoFactorEnabled(false);
        storage.updateSecuritySettings({ twoFactorEnabled: false, loginNotifications, sessionTimeout });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  const ToggleSwitch = ({
    enabled,
    onChange,
    label,
    description,
    icon: Icon,
  }: {
    enabled: boolean;
    onChange: () => void;
    label: string;
    description?: string;
    icon?: React.ElementType;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your app preferences and security</p>
        </div>
        {showSavedMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Settings saved!</span>
          </div>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {[
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "privacy", label: "Privacy", icon: Eye },
              { id: "security", label: "Security", icon: Lock },
              { id: "display", label: "Display", icon: Palette },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500">Choose how you want to be notified</p>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                </div>
                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={emailNewOrder}
                    onChange={() => setEmailNewOrder(!emailNewOrder)}
                    label="New Orders"
                    description="Receive email when you get a new order"
                    icon={ShoppingCart}
                  />
                  <ToggleSwitch
                    enabled={emailPayoutComplete}
                    onChange={() => setEmailPayoutComplete(!emailPayoutComplete)}
                    label="Payout Complete"
                    description="Receive email when a payout is processed"
                    icon={DollarSign}
                  />
                  <ToggleSwitch
                    enabled={emailLowStock}
                    onChange={() => setEmailLowStock(!emailLowStock)}
                    label="Low Stock Alert"
                    description="Receive email when inventory is running low"
                    icon={AlertCircle}
                  />
                  <ToggleSwitch
                    enabled={emailMarketing}
                    onChange={() => setEmailMarketing(!emailMarketing)}
                    label="Marketing & Updates"
                    description="Receive product updates and promotional emails"
                    icon={Megaphone}
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                </div>
                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={pushNewOrder}
                    onChange={() => setPushNewOrder(!pushNewOrder)}
                    label="New Orders"
                    description="Receive push notification for new orders"
                    icon={ShoppingCart}
                  />
                  <ToggleSwitch
                    enabled={pushPayoutComplete}
                    onChange={() => setPushPayoutComplete(!pushPayoutComplete)}
                    label="Payout Complete"
                    description="Receive push notification for completed payouts"
                    icon={DollarSign}
                  />
                  <ToggleSwitch
                    enabled={pushLowStock}
                    onChange={() => setPushLowStock(!pushLowStock)}
                    label="Low Stock Alert"
                    description="Receive push notification for low inventory"
                    icon={AlertCircle}
                  />
                  <ToggleSwitch
                    enabled={pushMarketing}
                    onChange={() => setPushMarketing(!pushMarketing)}
                    label="Marketing & Updates"
                    description="Receive promotional push notifications"
                    icon={Megaphone}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
                  <p className="text-sm text-gray-500">Control your profile visibility and data sharing</p>
                </div>
              </div>

              <div className="space-y-1 divide-y divide-gray-100">
                <ToggleSwitch
                  enabled={publicProfile}
                  onChange={() => setPublicProfile(!publicProfile)}
                  label="Public Profile"
                  description="Allow others to view your creator profile"
                />
                <ToggleSwitch
                  enabled={showEarnings}
                  onChange={() => setShowEarnings(!showEarnings)}
                  label="Show Earnings"
                  description="Display your total earnings on your public profile"
                />
                <ToggleSwitch
                  enabled={showProductCount}
                  onChange={() => setShowProductCount(!showProductCount)}
                  label="Show Product Count"
                  description="Display the number of products you've sold"
                />
                <ToggleSwitch
                  enabled={allowAnalytics}
                  onChange={() => setAllowAnalytics(!allowAnalytics)}
                  label="Allow Analytics"
                  description="Help us improve by sharing anonymous usage data"
                />
                <ToggleSwitch
                  enabled={shareDataWithPartners}
                  onChange={() => setShareDataWithPartners(!shareDataWithPartners)}
                  label="Share Data with Partners"
                  description="Allow sharing data with trusted marketing partners"
                />
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Data Protection</p>
                    <p className="text-sm text-gray-500 mt-1">
                      We take your privacy seriously. Your data is encrypted and stored securely. You can request a full export or deletion of your data at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-500">Protect your account with additional security</p>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="p-4 border border-gray-200 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handle2FAToggle}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        twoFactorEnabled
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {twoFactorEnabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                  {twoFactorEnabled && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">Two-factor authentication is enabled</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={loginNotifications}
                    onChange={() => setLoginNotifications(!loginNotifications)}
                    label="Login Notifications"
                    description="Get notified when your account is accessed from a new device"
                    icon={Key}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Session Timeout
                    </div>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Automatically log out after being inactive
                  </p>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    className="w-full sm:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sessionTimeouts.map((timeout) => (
                      <option key={timeout.value} value={timeout.value}>
                        {timeout.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Change Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Password</h2>
                    <p className="text-sm text-gray-500">Change your password</p>
                  </div>
                </div>

                <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
                    <p className="text-sm text-gray-500">Manage your logged-in devices</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Session</p>
                        <p className="text-xs text-gray-500">Windows • Chrome • Active now</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">This device</span>
                  </div>
                </div>

                <button className="mt-4 px-4 py-2 text-sm text-red-600 font-medium hover:text-red-700">
                  Log out of all other sessions
                </button>
              </div>
            </div>
          )}

          {activeTab === "display" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Display Settings</h2>
                  <p className="text-sm text-gray-500">Customize how the app looks and feels</p>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as typeof theme)}
                      className={`flex items-center gap-3 p-4 border rounded-xl transition-colors ${
                        theme === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option.icon
                        className={`w-5 h-5 ${
                          theme === option.value ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          theme === option.value ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 divide-y divide-gray-100 mb-6">
                <ToggleSwitch
                  enabled={compactMode}
                  onChange={() => setCompactMode(!compactMode)}
                  label="Compact Mode"
                  description="Show more content with reduced spacing"
                />
              </div>

              {/* Currency */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Currency
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Choose how prices are displayed throughout the app
                </p>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Choose how dates are displayed
                </p>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dateFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
