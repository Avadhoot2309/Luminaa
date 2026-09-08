import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'studentProfiles', currentUser.uid));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data());
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching student profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [currentUser]);

  const value = {
    profile,
    setProfile,
    loading
  };

  return (
    <ProfileContext.Provider value={value}>
      {!loading && children}
    </ProfileContext.Provider>
  );
};
