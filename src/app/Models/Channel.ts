export interface Channel
{
  id: string | null,
  channelName: string | null,
  noOfInteractions: number
}


export interface FavouriteChannel{
  userId: string | null,
  userName: string | null,
  channelId: string | null,
  channelName: string | null
}

export interface ChannelFavRes{
  id: string | null,
  userId: string | null,
  userName: string | null,
  channelId: string | null,
  channelName: string | null
}
