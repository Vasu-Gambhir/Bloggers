import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
import { EnvBindings } from "../types/env";
import { Variables } from "../types/context";
import { getPrisma } from "../lib/prisma";
import { createBlogInput, updateBlogInput } from "@vasu248/blog-app-commons";

const blogRoutes = new Hono<{ Bindings: EnvBindings; Variables: Variables }>();

blogRoutes.get("/", authMiddleware, async (c) => {
  try {
    const dbUrl = c.env.DATABASE_URL;
    const prisma = getPrisma(dbUrl);

    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 5);
    const sort = c.req.query("sort") === "oldest" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { postedDate: sort },
        select: {
          content: true,
          title: true,
          id: true,
          postedDate: true,
          published: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    return c.json({
      message: "Blogs fetched successfully",
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return c.json(
      { message: "Error in fetching blogs" + error },
      { status: 500 }
    );
  }
});

blogRoutes.get("/:id", authMiddleware, async (c) => {
  try {
    const dbUrl = c.env.DATABASE_URL;
    const prisma = getPrisma(dbUrl);
    const blogId = c.req.param("id");

    if (!blogId) {
      return c.json({ message: "No blog id provided" }, { status: 401 });
    }

    const blogById = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
      select: {
        content: true,
        title: true,
        id: true,
        postedDate: true,
        published: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!blogById) {
      return c.json(
        { message: "Blog not found please provide a valid blog id" },
        { status: 404 }
      );
    }

    return c.json(
      { message: `blog with id ${blogId} fetched successfully`, blogById },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return c.json(
      { message: "Error in fetching all blogs" + error },
      { status: 401 }
    );
  }
});

blogRoutes.post("/", authMiddleware, async (c) => {
  try {
    const dbUrl = c.env.DATABASE_URL;
    const prisma = getPrisma(dbUrl);
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if (!success) {
      return c.json({ message: "Invalid Inputs" }, { status: 411 });
    }

    const authorId = c.get("userId");

    const newBlog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    if (!newBlog) {
      return c.json({ message: "Error in creating new blog" }, { status: 400 });
    }

    return c.json(
      { message: "Blog created successfully", id: newBlog.id },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return c.json(
      { message: "Error in creating new blog" + error },
      { status: 400 }
    );
  }
});

blogRoutes.put("/", authMiddleware, async (c) => {
  try {
    const dbUrl = c.env.DATABASE_URL;
    const prisma = getPrisma(dbUrl);
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);

    if (!success) {
      return c.json({ message: "Invalid Inputs" }, { status: 411 });
    }
    const blogToBeUpdated = await prisma.post.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!blogToBeUpdated) {
      return c.json(
        {
          message: `Blog with the id ${body.id} not found, please provide a valid blog id`,
        },
        { status: 404 }
      );
    }

    const authorId = c.get("userId");
    if (authorId !== blogToBeUpdated.authorId) {
      return c.json(
        {
          message: `You are not authorized to edit or delete this blog`,
        },
        { status: 403 }
      );
    }

    const updatedBlog = await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
      },
    });

    const updatedBlogToSend = await prisma.post.findUnique({
      where: {
        id: updatedBlog.id,
      },
      select: {
        content: true,
        title: true,
        id: true,
        postedDate: true,
        published: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!updatedBlog) {
      return c.json({ status: 401 });
    }

    return c.json(
      {
        messgage: `Blog with id ${body.id} updated successfully`,
        updatedBlogToSend,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return c.json(
      { message: "Error in updating user" + error },
      { status: 401 }
    );
  }
});

blogRoutes.delete("/:id", authMiddleware, async (c) => {
  try {
    const dbUrl = c.env.DATABASE_URL;
    const prisma = getPrisma(dbUrl);
    const blogId = c.req.param("id");

    if (!blogId) {
      return c.json({ message: "No blog id provided" }, { status: 400 });
    }

    const blogToDelete = await prisma.post.findUnique({
      where: { id: blogId },
    });

    if (!blogToDelete) {
      return c.json(
        { message: `Blog with id ${blogId} not found` },
        { status: 404 }
      );
    }
    const authorId = c.get("userId");
    if (authorId !== blogToDelete.authorId) {
      return c.json(
        {
          message: `You are not authorized to edit or delete this blog`,
        },
        { status: 403 }
      );
    }
    await prisma.post.delete({
      where: { id: blogId },
    });

    return c.json(
      { message: `Blog with id ${blogId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: "Error in deleting blog: " + error },
      { status: 500 }
    );
  }
});

export default blogRoutes;
