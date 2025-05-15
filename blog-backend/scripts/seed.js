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

        const yourUser = await User.create({
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

        const yourBlogs = [
            // Technology Blogs
            {
                title: 'The Future of Artificial Intelligence',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'Artificial intelligence is transforming industries at an unprecedented pace. From healthcare to finance, AI applications are becoming more sophisticated and integrated into our daily lives. This post explores the latest advancements and what we can expect in the coming years.',
                author: yourUser._id,
                category: techCategory._id,
                category_name: techCategory.name
            },
            {
                title: 'Getting Started with React 18',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'React 18 introduces several exciting new features including concurrent rendering, automatic batching, and transitions. In this tutorial, we walk through setting up a new project and exploring these features with practical examples.',
                author: yourUser._id,
                category: techCategory._id,
                category_name: techCategory.name
            },
            {
                title: 'Blockchain Technology Explained',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'Beyond cryptocurrencies, blockchain has numerous applications in supply chain, healthcare, and digital identity. This post breaks down how blockchain works and examines real-world use cases that are changing industries.',
                author: yourUser._id,
                category: techCategory._id,
                category_name: techCategory.name
            },

            // Travel Blogs
            {
                title: 'Hidden Gems of Bali',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'While most tourists flock to the beaches of Kuta and Seminyak, Bali has countless hidden treasures waiting to be discovered. From the serene waterfalls of Munduk to the ancient temples of East Bali, this guide takes you off the beaten path.',
                author: yourUser._id,
                category: travelCategory._id,
                category_name: travelCategory.name
            },
            {
                title: 'Backpacking Through Europe on a Budget',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'Traveling through Europe doesn\'t have to break the bank. With careful planning and these money-saving tips, you can experience the rich cultures and stunning landscapes of Europe without spending a fortune. Includes hostel recommendations and transportation hacks.',
                author: yourUser._id,
                category: travelCategory._id,
                category_name: travelCategory.name
            },
            {
                title: 'Solo Travel in Japan: A Complete Guide',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'Japan is one of the safest and most rewarding destinations for solo travelers. From navigating the efficient transit system to etiquette at ryokans and onsens, this comprehensive guide covers everything you need to know for an unforgettable solo adventure.',
                author: yourUser._id,
                category: travelCategory._id,
                category_name: travelCategory.name
            },

            // Food Blogs
            {
                title: 'Mastering Sourdough Bread at Home',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'The art of sourdough baking combines science and tradition. This step-by-step guide covers creating and maintaining a starter, perfecting your kneading technique, and achieving that perfect crust and airy crumb that makes sourdough so special.',
                author: yourUser._id,
                category: foodCategory._id,
                category_name: foodCategory.name
            },
            {
                title: 'Authentic Indian Curry Recipes',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'Indian cuisine offers an incredible variety of flavors and techniques. This collection of authentic curry recipes includes butter chicken, chana masala, and vegetable korma, with tips on sourcing authentic spices and achieving the perfect balance of flavors.',
                author: yourUser._id,
                category: foodCategory._id,
                category_name: foodCategory.name
            },
            {
                title: 'Plant-Based Meal Prep for Beginners',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'Transitioning to a plant-based diet can seem daunting, but with proper meal prep it becomes effortless. This guide includes five easy, nutritious recipes that store well and can be mixed and matched throughout the week, along with storage tips and nutritional information.',
                author: yourUser._id,
                category: foodCategory._id,
                category_name: foodCategory.name
            },
            {
                title: 'The Art of French Pastry',
                blog_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
                content: 'French pastries are renowned for their delicate textures and precise techniques. This post demystifies classic recipes like croissants, éclairs, and macarons, with detailed instructions and troubleshooting tips for common challenges home bakers face.',
                author: yourUser._id,
                category: foodCategory._id,
                category_name: foodCategory.name
            }
        ];
        await Blog.insertMany(yourBlogs);

        console.log('10 Blogs created successfully');

        console.log('Database seeded successfully!');
        console.log('\nTest user:');
        console.log('- Email: harsh@example.com, Password: password123');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedData();