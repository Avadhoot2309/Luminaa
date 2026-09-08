import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { currentUser, studentUser, userProfile: authUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      // ✅ Step 6: Priority to Student PIN session
      if (studentUser) {
        setProfile(studentUser);
        setProfileComplete(true);
        setLoading(false);
        return;
      }

      if (!currentUser) {
        setProfile(null);
        setProfileComplete(false);
        setLoading(false);
        return;
      }

      // Logic for Teacher/Admin sessions
      if (authUserProfile) {
        setProfile(authUserProfile);
        setProfileComplete(true);
        setLoading(false);
        return;
      }

      try {
        // Fallback fetch if Auth context profile missing
        const profileDoc = await getDoc(doc(db, 'studentProfiles', currentUser.uid));
        if (profileDoc.exists()) {
          setProfile({ studentId: profileDoc.id, ...profileDoc.data() });
          setProfileComplete(true);
        } else {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setProfile({ uid: userDoc.id, ...userDoc.data() });
            setProfileComplete(true);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [currentUser, studentUser]);

  const updateProfile = async (newProfileData) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'studentProfiles', currentUser.uid), newProfileData, { merge: true });
      setProfile(prev => ({ ...prev, ...newProfileData }));
      setProfileComplete(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    profile,
    profileComplete,
    updateProfile,
    loading
  };

  return (
    <ProfileContext.Provider value={value}>
      {!loading && children}
    </ProfileContext.Provider>
  );
};
