import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import authService from "@/api/authService";

export const useProfileLogic = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });
  const [photoURL, setPhotoURL] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        const data = response.data;
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || ""
        });
        // Logic để load avatar nếu backend trả về URL hoặc xử lý ở FE
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile." });
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoURL(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validatePhone = (val: string) => /^[+\d\s-]*$/.test(val);

  const handleSubmitProfile = async () => {
    setIsSaving(true);
    try {
      if (avatarFile) await authService.uploadAvatar(avatarFile);
      await authService.updateProfile({ 
        fullName: formData.fullName, 
        phone: formData.phone, 
        address: formData.address 
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authService.deleteAccount(deletePassword);
      logout();
      navigate("/");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete account. Incorrect password?" });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    formData, setFormData, photoURL, setPhotoURL, handleAvatarChange, 
    validatePhone, handleSubmitProfile, isSaving, isDeleting, 
    showDeleteConfirm, setShowDeleteConfirm, deletePassword, 
    setDeletePassword, handleDeleteAccount, message, setMessage
  };
};
