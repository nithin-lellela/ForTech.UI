export interface Reply{
  id: string | null,
  forumId: string | null,
  userId: string | null,
  userName: string | null,
  description: string | null,
  dateCreated: string | null,
  forumReplyUpvotes: number,
  isLiked: boolean,
  profileImageUrl: string | null,
}

export interface ReplyDetails{
  id: string | null,
  forumId: string | null,
  userId: string | null,
  userName: string | null,
  description: string | null,
  dateCreated: string | null,
  forumReplyUpvotes: number,
  isLiked: boolean,
  profileImageUrl: any,
  isLoggedInUserReply: boolean
}

export interface ReplyRequest{
  forumId: string | null,
  userId: string | null,
  description: string | null
}
