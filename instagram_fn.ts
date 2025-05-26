import axios from "axios";

const BASE_URL = "https://graph.instagram.com/v22.0";

interface InstagramClientOptions {
  accessToken: string;
  appId: string;
}

/* 

This Functions file is changin to class sonner

Please check the new instagram.ts file

*/



interface UploadImage {
  image_url?: string;
  video_url?: string;
  alt_text :string
  caption: string;
  is_carousel_item?: string;
  media_type: string
  product_tags? : string 
  user_tags? : string
}

const createHeaders = (accessToken: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
});

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN!
const appId = process.env.INSTAGRAM_APP_ID!

// const accessToken = "IGAAZATQH9SA3pBZAE44SlNxRDFWZAE4xcmFiT2hmOVd3SjJ1X0pfTTVPc2dqZA21GWHdueWxtdV9zMnFhYkh6VVRTaHFHMzlUdUhRSGpJOHRKMWdTdXFLVEVvUTdKcEhvSUlSeExOaENGdWtxWmpPVFBSX2xsbllmckRhbG16bFp2ZAwZDZD"  
// const  appId = "17841407440691450"


export async function getPosts() {
  const headers = createHeaders(accessToken);

  const response = await axios.get(`${BASE_URL}/${appId}/media`, { headers });
  return response.data;
}

export async function getPostComments(postId: string) {
  const headers = createHeaders(accessToken);
  const response = await axios.get(`${BASE_URL}/${postId}/comments`, { headers });
  return response.data;
}

export async function getPostComment(commentId: string) {
  const headers = createHeaders(accessToken);
  const response = await axios.get(`${BASE_URL}/${commentId}`, { headers });
  return response.data;
}

export async function replyPostComment(
  commentId: string,
  message: string,
) {
  const headers = createHeaders(accessToken);
  const response = await axios.post(
    `${BASE_URL}/${commentId}/replies?message=${message}`,
    {},
    { headers }
  );
  return response.data;
}

export async function deletePostComment(commentId: string) {
  const headers = createHeaders(accessToken);
  const response = await axios.delete(`${BASE_URL}/${commentId}`, { headers });
  return response.data;
}

export async function UploadImage(
  {
    image_url,
    caption,
    is_carousel_item = "FALSE",
    media_type,
    alt_text,
    user_tags,
    product_tags
    
  }: UploadImage,
) {
  if (!image_url) {
    throw new Error("Either image_url or video_url must be provided.");
  }
  if (!caption) {
    throw new Error("Caption is required.");
  }

  const headers = createHeaders(accessToken);
  const body: Record<string, string | undefined> = {
    caption,
    is_carousel_item,
    media_type,
    alt_text,
    user_tags,
    product_tags 
  };

  const response = await axios.post(`${BASE_URL}/${appId}/media`, body, {
    headers,
  });
  console.log(response.data)
  const publishHeaders = createHeaders(accessToken);
  const publish = await axios.post(`${BASE_URL}/${appId}/media_publish`, {
    creation_id: response.data.id
  }, { headers : publishHeaders })

  return publish.data;
  
}

export async function publishMedia(creation_id: string) {
  const headers = createHeaders(accessToken);
  const publish = await axios.post(`${BASE_URL}/${appId}/media_publish`, {
    creation_id: creation_id
  }, { headers })

  return publish.data;
}







