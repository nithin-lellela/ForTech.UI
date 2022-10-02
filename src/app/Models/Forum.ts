export interface Forum{
  id: string | null,
  userId: string | null,
  channelId: string | null,
  userName: string | null,
  channelName: string | null,
  description: string | null,
  dateCreated: string | null,
  forumUpvotes: number,
  forumReplies: number,
  isLiked: boolean,
  profileImageUrl: string | null
}

export interface DiscussionForum{
  id: string | null,
  userId: string | null,
  channelId: string | null,
  userName: string | null,
  channelName: string | null,
  description: string | null,
  dateCreated: string | null,
  forumUpvotes: number,
  forumReplies: number,
  isLiked: boolean,
  profileImagePath: any,
  isLoggedInUserPost: boolean;
  hideComment: boolean;
}
