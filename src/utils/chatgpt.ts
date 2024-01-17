import { ChatGPTAPI } from 'chatgpt';

const globalForChatGPT = global as unknown as { chatGPTApi: ChatGPTAPI };

export const chatGPTApi =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  globalForChatGPT.chatGPTApi ||
  new ChatGPTAPI({
    apiKey: process.env.CHATGPT_API_KEY as string,
  });

if (process.env.NODE_ENV !== 'production') globalForChatGPT.chatGPTApi = chatGPTApi;

export enum Prompt {
  QuestionReceived = 'Ucapan "Terima kasih kerana menghantar soalan kepada Tanya Koding" yang lawak dalam bahasa Melayu Malaysia 15-20 patah perkataan, gunakan \'kami\' sebagai ganti diri.',
}

export enum FailureMessage {
  QuestionReceived = 'Terima kasihlah bro sebab bagi kami kesempatan nak menjawab soalan korang yang hebat ni kat Tanya Koding.',
}

export const removeQuotes = (str: string) => {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.replace(/^"|"$/g, '');
  }
  return str;
};
