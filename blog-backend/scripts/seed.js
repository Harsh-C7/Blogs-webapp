const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017/blog-api';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    blog_image_url: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    category_name: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Blog = mongoose.model('Blog', blogSchema);

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Category.deleteMany({});
        await Blog.deleteMany({});
        console.log('Cleared existing data');

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user1 = await User.create({
            name: 'Harsh Chourasia',
            email: 'harsh@example.com',
            password: hashedPassword
        });

        console.log('Users created');

        const techCategory = await Category.create({
            name: 'Technology',
            description: 'Posts about technology and innovations'
        });

        const travelCategory = await Category.create({
            name: 'Travel',
            description: 'Posts about travel experiences'
        });

        const foodCategory = await Category.create({
            name: 'Food',
            description: 'Posts about cooking and dining'
        });

        console.log('Categories created');

        const blogs = [
            {
                title: 'Getting Started with Nest.js',
                blog_image_url: 'https://example.com/images/nestjs.jpg',
                content: 'Nest.js is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. In this blog post, we\'ll explore the basics of Nest.js and how to set up your first project.',
                author: user1._id,
                category: techCategory._id,
                category_name: techCategory.name
            },
            {
                title: 'My Trip to Barcelona',
                blog_image_url: 'https://example.com/images/barcelona.jpg',
                content: 'Barcelona is a beautiful city with amazing architecture, delicious food, and friendly people. Here\'s my experience visiting the city for the first time and the must-see attractions.',
                author: user1._id,
                category: travelCategory._id,
                category_name: travelCategory.name
            },
            {
                title: 'Homemade Pizza Recipe',
                blog_image_url: 'https://example.com/images/pizza.jpg',
                content: 'Making pizza at home is easier than you think. Here\'s my favorite recipe for a delicious homemade pizza that your family will love.',
                author: user2._id,
                category: foodCategory._id,
                category_name: foodCategory.name
            },
            {
                title: 'React vs Angular: Which Should You Choose?',
                blog_image_url: 'https://example.com/images/frontend.jpg',
                content: 'React and Angular are two of the most popular frontend frameworks. In this blog post, we\'ll compare the two frameworks and help you decide which one is right for your project.',
                author: user2._id,
                category: techCategory._id,
                category_name: techCategory.name
            }
        ];

        await Blog.insertMany(blogs);
        console.log('Blogs created');

        console.log('Database seeded successfully!');
        console.log('\nTest users:');
        console.log('- Email: harsh@example.com, Password: password123');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedData();