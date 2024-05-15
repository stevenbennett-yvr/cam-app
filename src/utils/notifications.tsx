import { DEBUG_MODE } from '../constants/data';
import { hideNotification, showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export function throwError(message: string, debugOnly?: boolean) {
    if (debugOnly && !DEBUG_MODE) return;
  
    displayError(message);
    throw new Error(message);
  }
  
  export function displayError(message: string, debugOnly?: boolean) {
    if (debugOnly && !DEBUG_MODE) return;
  
    const id = message;
    hideNotification(id);
    showNotification({
      id: id,
      title: 'Error',
      message: message,
      autoClose: false,
      color: 'red',
      icon: <IconX />,
    });
  }