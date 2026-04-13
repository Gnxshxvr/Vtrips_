import { create } from 'zustand'

export const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthModalOpen: false,
  setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  theme: 'dark', // 'dark' or 'light'
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (newTheme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
      return { theme: newTheme };
    });
  },
  savedTrips: [],
  setSavedTrips: (trips) => set({ savedTrips: trips }),
  currentPlan: null,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  isGenerating: false,
  setIsGenerating: (status) => set({ isGenerating: status }),
}))
