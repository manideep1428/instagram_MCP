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
    throw new Error("image_url must be provided.");
  }
  if (!caption) {
    throw new Error("Caption is required.");
  }

  const headers = createHeaders(accessToken);
  
  // Create the request body with all required parameters
  const body = new URLSearchParams();
  body.append('image_url', image_url);
  body.append('caption', caption);
  body.append('is_carousel_item', is_carousel_item);
  body.append('media_type', media_type);
  body.append('alt_text', alt_text);
  
  if (user_tags) {
    body.append('user_tags', user_tags);
  }
  if (product_tags) {
    body.append('product_tags', product_tags);
  }

  try {
    console.log('Creating media container...');
    const createResponse = await axios.post(
      `${BASE_URL}/${appId}/media`,
      body.toString(),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    console.log('Media container created:', createResponse.data);
    
    const creationId = createResponse.data.id;
    if (!creationId) {
      throw new Error('No creation ID returned from Instagram API');
    }
    
    // Wait a moment before publishing to ensure the container is ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Publishing media...');
    const publishResponse = await axios.post(
      `${BASE_URL}/${appId}/media_publish`,
      new URLSearchParams({
        creation_id: creationId
      }).toString(),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    console.log('Media published successfully:', publishResponse.data);
    return publishResponse.data;
    
  } catch (error: any ) {
    console.error('Error in UploadImage:', error.response?.data || error.message);
    throw error;
  }
}

export async function publishMedia(creation_id: string) {
  const headers = createHeaders(accessToken);
  const publish = await axios.post(`${BASE_URL}/${appId}/media_publish`, {
    creation_id: creation_id
  }, { headers })

  return publish.data;
}







