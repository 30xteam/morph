import { toast } from 'sonner';
import type { ExternalToast } from 'sonner';

import { playToastSound } from './toast-sound';

/**
 * Shows a toast and plays its chime. Use it for feedback on an action the person just took.
 */
export const notify = {
  success(title: string, options?: ExternalToast) {
    playToastSound('success');
    return toast.success(title, options);
  },
  info(title: string, options?: ExternalToast) {
    playToastSound('info');
    return toast.info(title, options);
  },
  complete(title: string, options?: ExternalToast) {
    playToastSound('complete');
    return toast.success(title, options);
  },
  undo(title: string, options?: ExternalToast) {
    playToastSound('undo');
    return toast(title, options);
  },
};
