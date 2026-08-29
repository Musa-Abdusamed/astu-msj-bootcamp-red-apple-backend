import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { sharedService } from '../../api/sharedService';
import { useAuth } from '../../context/AuthContext';
import { SERVER_URL } from '../../api/axios';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, KeyRound, Lock, UserCheck, Upload, Image as ImageIcon, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isFirstLogin = Boolean(location.state?.firstLogin || user?.mustChangeCredentials);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsCropModalOpen(true);
      e.target.value = ''; // Reset so the same file can be chosen again if needed
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(avatarPreview, croppedAreaPixels);
      setAvatarFile(croppedImageBlob);
      setAvatarPreview(URL.createObjectURL(croppedImageBlob));
      setIsCropModalOpen(false);
    } catch (e) {
      console.error(e);
      setAvatarError('Failed to crop image.');
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    setAvatarLoading(true);
    setAvatarSuccess('');
    setAvatarError('');
    try {
      const formData = new FormData();
      formData.append('profilePicture', avatarFile);
      const res = await sharedService.updateAvatar(formData);
      const newAvatar = res.data?.avatar || res.avatar;
      updateUser({ avatar: newAvatar });
      setAvatarSuccess('Profile picture updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      setAvatarError(err.response?.data?.message || err.message || 'Failed to update avatar.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setError('Your new password must be different from your current one-time password.');
      return;
    }

    setLoading(true);

    try {
      await sharedService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      // Update user state so mustChangeCredentials becomes false
      updateUser({ mustChangeCredentials: false });

      setSuccess('Your password has been successfully updated! Your account is now fully secured.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const userRole = user?.role || 'student';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-sm text-slate-500">Manage your security credentials and profile information</p>
        </div>
      </div>

      {/* Forced Password Change Notice */}
      {isFirstLogin && !success && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-xs animate-fadeIn">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Action Required: Change Your One-Time Password
            </h3>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              You are signed in with a temporary One-Time Password sent to your email. For your account security, you must create a new permanent password before continuing.
            </p>
          </div>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Account Credentials</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Unique ID</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">{user?.userId || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Full Name</span>
            <span className="font-semibold text-slate-800 text-sm">{user?.fullName || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Assigned Role</span>
            <span className="capitalize font-semibold text-slate-800 text-sm">{user?.role || 'student'}</span>
          </div>
        </div>
      </div>

      {/* Profile Picture Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="w-6 h-6 text-indigo-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Profile Picture</h2>
            <p className="text-xs text-slate-500">Update your avatar. PNG or JPG, max 5MB.</p>
          </div>
        </div>

        {avatarSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2.5 border border-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">{avatarSuccess}</span>
          </div>
        )}
        
        {avatarError && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-center gap-2.5 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{avatarError}</span>
          </div>
        )}

        <form onSubmit={handleAvatarUpload} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : user?.avatar && user.avatar !== 'default-avatar.png' ? (
              <img src={`${SERVER_URL}/uploads/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCheck className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1 space-y-3 w-full">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border-0
                file:text-xs file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 transition-colors cursor-pointer"
            />
            <button 
              type="submit" 
              disabled={avatarLoading || !avatarFile}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>{avatarLoading ? 'Uploading...' : 'Upload Avatar'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-6 h-6 text-indigo-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isFirstLogin ? 'Set Permanent Password' : 'Change Password'}
            </h2>
            <p className="text-xs text-slate-500">
              {isFirstLogin 
                ? 'Replace your temporary One-Time Password with your own secure password.' 
                : 'Update your password regularly to keep your account safe.'}
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">{success}</span>
            </div>
            <button
              onClick={() => navigate(`/${userRole}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex items-center gap-2.5 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFirstLogin ? 'Current One-Time Password' : 'Current Password'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="password" 
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                required
                placeholder="Enter current / one-time password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">New Permanent Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="password" 
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Must be at least 8 characters long.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="password" 
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
                minLength={8}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-900"
              />
            </div>
          </div>
          
          <div className="pt-2 flex items-center gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                'Updating Password...'
              ) : (
                <>
                  <span>{isFirstLogin ? 'Set New Password & Continue' : 'Update Password'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            {isFirstLogin && !user?.mustChangeCredentials && (
              <Link
                to={`/${userRole}`}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                Skip to Dashboard
              </Link>
            )}
          </div>
        </form>
      </div>
      
      {/* Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Crop Profile Picture</h3>
              <button type="button" onClick={() => setIsCropModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-full h-64 bg-slate-100">
              <Cropper
                image={avatarPreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-slate-500">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="flex-1 accent-indigo-600"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={showCroppedImage}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
                >
                  Confirm Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
