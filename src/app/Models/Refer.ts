export interface Refer{
  id: string | null,
  forumId: string | null,
  forumUserName: string | null,
  forumUserId: string | null,
  channelId: string | null,
  channelName: string | null
  senderUserId: string | null,
  receiverUserId: string | null,
  dateCreated: string | null,
  isReferOpened: boolean,
  senderUserName: string | null,
  receiverUserName: string | null,
  profileImageUrl: string | null
}

export interface ReferRequest{
  forumId: string | null,
  channelId: string | null,
  channelName: string | null,
  forumOwnerName: string | null,
  forumUserId: string | null,
  senderUserId: string | null,
  receiverUserId: string | null,
}
