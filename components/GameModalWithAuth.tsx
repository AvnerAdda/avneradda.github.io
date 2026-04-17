"use client";

import { AuthProvider } from '../lib/context/AuthContext';
import GameModal from './GameModal';

interface GameModalWithAuthProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModalWithAuth({ isOpen, onClose }: GameModalWithAuthProps) {
  return (
    <AuthProvider>
      <GameModal isOpen={isOpen} onClose={onClose} />
    </AuthProvider>
  );
}
