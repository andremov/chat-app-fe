export type ErrorMessageType = {
  type: 'error';
  payload: {
    error: string;
  };
};

export type MessageType =
  | ErrorMessageType
  | {
      type: 'message' | 'system-message';
      payload: {
        user: string;
        userId?: string;
        text: string;
      };
      timestamp: string;
    };
