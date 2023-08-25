import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Google Sign-In once when the component mounts
    GoogleSignin.configure({
      webClientId:
        "905593881504-ne2dm8h5nf9r62numv3qs9vsjn2purlg.apps.googleusercontent.com", // Replace with your actual Web Client ID
    });

    // Load user data from AsyncStorage during component initialization
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Authenticate with Firebase
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );
      await auth().signInWithCredential(googleCredential);
      // Save user data to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userInfo));

      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User canceled the sign-in process
        console.log("Sign-in process canceled");
      } else {
        console.error("Google Sign-In Error:", error);
      }
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut(); // Sign out from Firebase
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem("user");
      setUser(null);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {user ? (
        <>
          <Text>Welcome, {user.user.name}!</Text>
          <Button title="Sign Out" onPress={handleGoogleSignOut} />
        </>
      ) : (
        <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
      )}
    </View>
  );
};

export default App;
