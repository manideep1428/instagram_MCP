import axios from "axios";

interface InstagramClientOptions {
  accessToken: string;
  appId: string;
}

interface UploadMediaOptions {
  image_url?: string;
  video_url?: string;
  caption: string;
  is_carousel_item?: string;
  media_type: string;
}

export class InstagramClient {
  private readonly BASE_URL = "https://graph.instagram.com/v22.0";
  private readonly accessToken: string;
  private readonly appId: string;
  private readonly headers: Record<string, string>;

  constructor({ accessToken, appId }: InstagramClientOptions) {
    if (!accessToken || !appId) {
      throw new Error("Both accessToken and appId are required.");
    }

    this.accessToken = accessToken;
    this.appId = appId;

    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  async getPosts(): Promise<any> {
    try {
      const res = await axios.get(`${this.BASE_URL}/${this.appId}/media`, {
        headers: this.headers,
      });
      return res.data;
    } catch (err) {
      throw new Error("Failed to fetch posts.");
    }
  }

  async getPostComments(postId: string): Promise<any> {
    try {
      const res = await axios.get(`${this.BASE_URL}/${postId}/comments`, {
        headers: this.headers,
      });
      return res.data;
    } catch (err) {
      throw new Error(`Failed to get comments for post ID: ${postId}`);
    }
  }

  async getCommentReplies(commentId: string): Promise<any> {
    try {
      const res = await axios.get(`${this.BASE_URL}/${commentId}/replies`, {
        headers: this.headers,
      });
      return res.data;
    } catch (err) {
      throw new Error(`Failed to get replies for comment ID: ${commentId}`);
    }
  }

  async replyToComment(commentId: string, message: string): Promise<any> {
    try {
      const res = await axios.post(
        `${this.BASE_URL}/${commentId}/replies?message=${encodeURIComponent(message)}`,
        {},
        { headers: this.headers }
      );
      return res.data;
    } catch (err) {
      throw new Error(`Failed to reply to comment ID: ${commentId}`);
    }
  }

  async deleteComment(commentId: string): Promise<any> {
    try {
      const res = await axios.delete(`${this.BASE_URL}/${commentId}`, {
        headers: this.headers,
      });
      return res.data;
    } catch (err) {
      throw new Error(`Failed to delete comment ID: ${commentId}`);
    }
  }

  async uploadMedia({
    image_url,
    video_url,
    caption,
    is_carousel_item = "FALSE",
    media_type,
  }: UploadMediaOptions): Promise<any> {
    try {
      if (!caption) throw new Error("Caption is required.");
      if (!image_url && !video_url) {
        throw new Error("Either image_url or video_url must be provided.");
      }
      if (image_url && video_url) {
        throw new Error("Only one of image_url or video_url should be provided.");
      }

      const body: Record<string, string> = {
        caption,
        is_carousel_item,
        media_type,
      };

      if (image_url) body.image_url = image_url;
      if (video_url) body.video_url = video_url;

      // Step 1: Create the media container
      const createRes = await axios.post(
        `${this.BASE_URL}/${this.appId}/media`,
        body,
        { headers: this.headers }
      );

      const creationId = createRes.data.id;
      if (!creationId) {
        throw new Error("Failed to create media container.");
      }

      // Step 2: Publish the media
      const publishRes = await axios.post(
        `${this.BASE_URL}/${this.appId}/media_publish`,
        { creation_id: creationId },
        { headers: this.headers }
      );

      return publishRes.data;
    } catch (err: any) {
      throw new Error(`Upload failed: ${err.message}`);
    }
  }
}
