import { useEffect, useState, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
  const [webcontainerInstance, setWebcontainerInstance] = useState(null);
  const [status, setStatus] = useState('uninitialized'); // uninitialized, booting, ready, error
  const isBooting = useRef(false);

  useEffect(() => {
    if (webcontainerInstance || isBooting.current) return;
    isBooting.current = true;
    setStatus('booting');

    async function bootContainer() {
      try {
        // Call the WebAssembly bootstrapper
        const instance = await WebContainer.boot();
        setWebcontainerInstance(instance);
        setStatus('ready');
      } catch (error) {
        console.error("WebContainer failed to boot:", error);
        setStatus('error');
      }
    }

    bootContainer();
  }, []);

  return { webcontainerInstance, status };
}