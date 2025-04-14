export enum ESystemError {
  syserr_chatting_send_post = 'There is something wrong. Please try again.',

  syserr_chat_stream_error = 'Stream encountered an error or connection was lost. Please try again.',
}

export function checkChatSystemError(txt: string): boolean {
  if (
    // not parsed
    txt.includes(`${ESystemError.syserr_chatting_send_post}`) ||
    txt.includes(`${ESystemError.syserr_chat_stream_error}`) ||
    // parsed
    txt.includes(`${ESystemError.syserr_chatting_send_post.replaceAll('%', '')}`) ||
    txt.includes(`${ESystemError.syserr_chat_stream_error.replaceAll('%', '')}`)
  ) {
    return true;
  }

  return false;
}
