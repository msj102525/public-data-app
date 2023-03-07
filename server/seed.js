const userArgs = process.argv.slice(2);
const mongoose = require("mongoose");
const User = require('./models/User');
const Article = require('./models/Article');

if (!userArgs[0].startsWith('mongodb')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return;
}

async function seedDatabase() {
  try {
    const MONGODB_URI = userArgs[0];

    await mongoose.connect(MONGODB_URI);

    const users = [
      {
        username: 'cat',
        email: 'cat@example.com',
        fullName: 'Kitty',
        image: 'cat.jpeg',
        bio: 'Meow',
      },
      {
        username: 'dog',
        email: 'dot@example.com',
        fullName: 'Mr.Loyal',
        image: 'dog.jpeg',
        bio: 'Bark',
      },
      {
        username: 'bird',
        email: 'bird@example.com',
        fullName: 'Blue and White',
        image: 'bird.jpeg',
        bio: '',
      }
    ]

    // 유저 생성 쿼리
    for (let i = 0; i < users.length; i++) {
      const user = new User();
      user.email = users[i].email;
      user.username = users[i].username;
      user.fullName = users[i].fullName;
      user.image = users[i].image;
      user.bio = users[i].bio;

      await user.save();

      console.log(user);
    }

    // 게시물 생성 쿼리

    for (let i = 1; i <= 4; i++) {
      const user = await User.findOne({ username: 'cat' });

      const article = new Article();
      article.images = [`${i}.jpeg`];
      article.description = `cat photos ${i}`;
      article.author = user._id;

      await article.save();

      console.log(article);
    }

    // 데이터베이스 연결 종료
    mongoose.connection.close();

  } catch (error) {
    console.error(error);
  }
}

seedDatabase();