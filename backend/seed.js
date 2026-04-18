require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Event = require('./models/eventModel');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@ematbs.com' });
    let adminId;

    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@ematbs.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
      });
      adminId = admin._id;
      console.log('✅ Admin user created: admin@ematbs.com / admin123');
    } else {
      adminId = adminExists._id;
      console.log('ℹ️  Admin user already exists');
    }

    // Seed events if none exist
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const sampleEvents = [
        {
          title: 'Neon Pulse Music Festival',
          category: 'Music',
          date: new Date('2026-05-15'),
          time: '18:00',
          venue: 'Aurora Arena',
          city: 'Mumbai',
          image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
          banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=500&fit=crop',
          description: 'Experience an electrifying night of pulsating beats, stunning visuals, and world-class DJs. The Neon Pulse Music Festival features 3 stages, immersive light shows, and a lineup that will keep you dancing until dawn.',
          organizer: 'SoundWave Productions',
          pricing: { VIP: 4999, Premium: 2999, General: 999 },
          totalSeats: 150,
          bookedSeats: 0,
          bookedSeatIds: [],
          featured: true,
          tags: ['Electronic', 'Live DJ', 'Night Event'],
          rating: 4.8,
          createdBy: adminId,
        },
        {
          title: 'TechVerse Summit 2026',
          category: 'Conference',
          date: new Date('2026-06-02'),
          time: '09:00',
          venue: 'Convention Center',
          city: 'Bangalore',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
          banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=500&fit=crop',
          description: 'The premier tech conference bringing together innovators, entrepreneurs, and thought leaders. Featuring keynotes from industry giants, hands-on workshops, and networking opportunities.',
          organizer: 'TechVerse Inc.',
          pricing: { VIP: 7999, Premium: 4999, General: 1999 },
          totalSeats: 150,
          bookedSeats: 0,
          bookedSeatIds: [],
          featured: true,
          tags: ['AI', 'Startups', 'Innovation'],
          rating: 4.9,
          createdBy: adminId,
        },
        {
          title: 'Cosmic Comedy Night',
          category: 'Comedy',
          date: new Date('2026-04-28'),
          time: '20:00',
          venue: 'Laugh Factory',
          city: 'Delhi',
          image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=600&h=400&fit=crop',
          banner: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=1200&h=500&fit=crop',
          description: 'A stellar lineup of comedians ready to take you on a cosmic journey of laughter. Featuring both established and rising stars of the comedy scene.',
          organizer: 'HaHa Events',
          pricing: { VIP: 2499, Premium: 1499, General: 699 },
          totalSeats: 150,
          bookedSeats: 0,
          bookedSeatIds: [],
          featured: false,
          tags: ['Stand-up', 'Live Show', 'Entertainment'],
          rating: 4.6,
          createdBy: adminId,
        },
        {
          title: 'Art Beyond Boundaries',
          category: 'Exhibition',
          date: new Date('2026-05-20'),
          time: '10:00',
          venue: 'National Gallery',
          city: 'Mumbai',
          image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=600&h=400&fit=crop',
          banner: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200&h=500&fit=crop',
          description: 'An immersive art exhibition featuring interactive installations, digital art, and works from 50+ contemporary artists from around the world.',
          organizer: 'ArtSpace Collective',
          pricing: { VIP: 1999, Premium: 999, General: 499 },
          totalSeats: 150,
          bookedSeats: 0,
          bookedSeatIds: [],
          featured: true,
          tags: ['Digital Art', 'Interactive', 'Contemporary'],
          rating: 4.7,
          createdBy: adminId,
        },
        {
          title: 'Midnight Marathon 2026',
          category: 'Sports',
          date: new Date('2026-06-10'),
          time: '23:00',
          venue: 'Marine Drive',
          city: 'Mumbai',
          image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&h=400&fit=crop',
          banner: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1200&h=500&fit=crop',
          description: 'Run under the stars along the iconic Marine Drive. Categories include 5K, 10K, 21K, and Full Marathon. Finishers receive medals and exclusive merchandise.',
          organizer: 'RunIndia Foundation',
          pricing: { VIP: 3499, Premium: 1999, General: 799 },
          totalSeats: 150,
          bookedSeats: 0,
          bookedSeatIds: [],
          featured: false,
          tags: ['Running', 'Night Event', 'Fitness'],
          rating: 4.5,
          createdBy: adminId,
        },
        {
          title: 'Culinary Odyssey',
          category: 'Food',
          date: new Date('2026-05-08'),
          time: '12:00',
          venue: 'Grand Hyatt',
          city: 'Hyderabad',
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
          banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=500&fit=crop',
          description: 'A gastronomic journey featuring celebrity chefs, live cooking demos, tasting sessions, and a grand food market with cuisines from 20+ countries.',
          organizer: 'FoodieVerse',
          pricing: { VIP: 5999, Premium: 3499, General: 1499 },
          totalSeats: 150,
          bookedSeats: 0,
          bookedSeatIds: [],
          featured: true,
          tags: ['Gourmet', 'Celebrity Chef', 'Tasting'],
          rating: 4.8,
          createdBy: adminId,
        },
      ];

      await Event.insertMany(sampleEvents);
      console.log(`✅ ${sampleEvents.length} sample events seeded`);
    } else {
      console.log(`ℹ️  ${eventCount} events already exist, skipping seed`);
    }

    console.log('\n🎉 Seed complete!');
    console.log('───────────────────────');
    console.log('Admin Login:');
    console.log('  Email:    admin@ematbs.com');
    console.log('  Password: admin123');
    console.log('───────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
