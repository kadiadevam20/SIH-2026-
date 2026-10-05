import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { useApp } from '@/context/AppContext';

/** Old hold screen removed — SOS bar already confirms, go straight to emergency. */
export default function SosRedirect() {
  const { startEmergency } = useApp();

  useEffect(() => {
    startEmergency();
  }, [startEmergency]);

  return <Redirect href="/emergency" />;
}
