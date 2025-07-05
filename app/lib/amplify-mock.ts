// Mock Amplify configuration for development without AWS
export const mockAmplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "mock-user-pool",
      userPoolClientId: "mock-client-id",
      identityPoolId: "mock-identity-pool",
    },
  },
};

// Mock user for development
export const mockUser = {
  userId: "mock-user-123",
  username: import.meta.env.VITE_MOCK_USER_EMAIL || "dev@example.com",
  signInDetails: {
    loginId: import.meta.env.VITE_MOCK_USER_EMAIL || "dev@example.com",
  },
};

// Mock authentication functions
export const mockAuth = {
  getCurrentUser: async () => {
    if (import.meta.env.VITE_USE_MOCK_AUTH === "true") {
      const isLoggedIn = localStorage.getItem("mockAuthToken");
      if (isLoggedIn) {
        return mockUser;
      }
      throw new Error("Not authenticated");
    }
    throw new Error("Mock auth not enabled");
  },
  
  signIn: async (credentials: { username: string; password: string }) => {
    if (import.meta.env.VITE_USE_MOCK_AUTH === "true") {
      // Accept any credentials in mock mode
      localStorage.setItem("mockAuthToken", "mock-token");
      return {
        isSignedIn: true,
        nextStep: { signInStep: "DONE" },
      };
    }
    throw new Error("Mock auth not enabled");
  },
  
  signOut: async () => {
    if (import.meta.env.VITE_USE_MOCK_AUTH === "true") {
      localStorage.removeItem("mockAuthToken");
      return {};
    }
    throw new Error("Mock auth not enabled");
  },
};