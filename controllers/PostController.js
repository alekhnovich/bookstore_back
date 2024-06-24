import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tagsCount = posts.reduce((acc, post) => {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    const sortedTags = Object.entries(tagsCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => tag);

    const topTags = sortedTags.slice(0, 10);

    res.json(topTags);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось получить теги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { tag, sort } = req.query;
    const query = tag ? { tags: tag } : {};
    let sortOption = {};

    if (sort === 'views') {
      sortOption = { viewsCount: -1 };
    } else {
      sortOption = { createdAt: -1 }; 
    }

    const posts = await PostModel.find(query).populate('user').sort(sortOption).exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true } // 'new: true' возвращает обновленный документ
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);
    console.log('Returned post:', doc);
  } catch (err) {
    console.error('Error fetching post:', err); // Добавлено больше информации для логирования
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      price: req.body.price, // Добавлено поле price
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        price: req.body.price, // Добавлено поле price
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

// Новый метод для добавления комментария
export const addCommentToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    const comment = {
      text,
      user: req.userId,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    const populatedComment = await PostModel.populate(comment, { path: 'user', select: 'fullName avatarUrl' });

    res.json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось добавить комментарий' });
  }
};

// Новый метод для получения комментариев
export const getCommentsForPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId).populate({
      path: 'comments.user',
      select: 'fullName avatarUrl',
    });

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось получить комментарии' });
  }
};
