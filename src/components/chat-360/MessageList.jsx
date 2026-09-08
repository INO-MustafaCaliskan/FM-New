import { ChatInputBox } from "./ChatInputBox";
import { MessageListHeader } from "./MessageListHeader";
import { Messages } from "./Messages";

export const MessageList = ({messagesLoading}) => {
  return (
    <>
        <MessageListHeader/>
        <Messages messagesLoading={messagesLoading} />
        <ChatInputBox />
    </>
  )
}
