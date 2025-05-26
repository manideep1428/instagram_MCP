import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod"
import { deletePostComment, getPostComment, getPostComments, getPosts, replyPostComment, UploadImage } from "./instagram_fn";


// const instagramClient = new InstagramClient({accessToken:"IGAAZATQH9SA3pBZAE44SlNxRDFWZAE4xcmFiT2hmOVd3SjJ1X0pfTTVPc2dqZA21GWHdueWxtdV9zMnFhYkh6VVRTaHFHMzlUdUhRSGpJOHRKMWdTdXFLVEVvUTdKcEhvSUlSeExOaENGdWtxWmpPVFBSX2xsbllmckRhbG16bFp2ZAwZDZD" , appId : "17841407440691450"})

const server = new McpServer({
  transport: new StdioServerTransport(),
  name: "Instagram",
  version: "1.0.0"
});

server.tool("getPosts", async () => {
  {
    const posts = await getPosts();
    return { content: [{ type: "text", text: JSON.stringify(posts) }] }
  }
});

server.tool("getPostComments", { postId: z.string() }, async ({ postId }: { postId: string }) => {
  {
    const comments = await getPostComments(postId);
    return { content: [{ type: "text", text: JSON.stringify(comments) }] }
  }
})

server.tool("getPostComment", { commentId: z.string() }, async ({ commentId }: { commentId: string }) => {
  {
    const comment = await getPostComment(commentId);
    return { content: [{ type: "text", text: JSON.stringify(comment) }] }
  }
})

server.tool("replyPostComment", { commentId: z.string(), message: z.string() }, async ({ commentId, message }: { commentId: string, message: string }) => {
  {
    const comment = await replyPostComment(commentId, message);
    return { content: [{ type: "text", text: JSON.stringify(comment) }] }
  }
})

server.tool("deletePostComment", { commentId: z.string() }, async ({ commentId }: { commentId: string }) => {
  {
    const comment = await deletePostComment(commentId);
    return { content: [{ type: "text", text: JSON.stringify(comment) }] }
  }
})

server.tool("postMedia", {
  image_url: z.string(),
  caption: z.string(),
  alt_text: z.string(),
  media_type: z.string().transform((value) => value.toUpperCase()),
  is_carousel_item: z.string().transform((value) => value.toUpperCase()),
  video_url: z.string().optional(),
  user_tags: z.string().optional(),
  product_tags: z.string().optional()
}, async ({ image_url, caption, media_type, is_carousel_item, alt_text, user_tags, product_tags }) => {
  {
    const post = await UploadImage({
      image_url,
      caption,
      media_type,
      is_carousel_item,
      alt_text,
      product_tags,
      user_tags
    });


  return { content: [{ type: "text", text: post?.data?.id }] }

  }


});


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});