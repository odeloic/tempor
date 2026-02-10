import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

export function useProjectPicker() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const dismiss = useCallback(() => setVisible(false), []);
  const create = useCallback(() => {
    setVisible(false);
    router.push('/project/new');
  }, [router]);

  return { visible, open, dismiss, create };
}
