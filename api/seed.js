import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const listingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        regularPrice: { type: Number, required: true },
        discountPrice: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        furnished: { type: Boolean, required: true },
        parking: { type: Boolean, required: true },
        type: { type: String, required: true },
        offer: { type: Boolean, required: true },
        imageUrls: { type: Array, required: true },
        userRef: { type: String, required: true },
    },
    { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

const sampleListings = [
    {
        name: "Modern Downtown Apartment",
        description: "Beautiful modern apartment in the heart of downtown. Features floor-to-ceiling windows, hardwood floors, and a gourmet kitchen with stainless steel appliances. Walking distance to restaurants, shops, and public transit.",
        address: "123 Main Street, New York, NY 10001",
        regularPrice: 2500,
        discountPrice: 2200,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Cozy Suburban Family Home",
        description: "Spacious family home in a quiet suburban neighborhood. Features a large backyard, updated kitchen, and a two-car garage. Great school district and close to parks and community centers.",
        address: "456 Oak Avenue, Austin, TX 78701",
        regularPrice: 350000,
        discountPrice: 325000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Luxury Waterfront Villa",
        description: "Stunning waterfront property with panoramic ocean views. This luxury villa features a private pool, spa, chef's kitchen, and direct beach access. Perfect for those seeking the ultimate coastal lifestyle.",
        address: "789 Ocean Drive, Miami, FL 33139",
        regularPrice: 1200000,
        discountPrice: 1100000,
        bathrooms: 5,
        bedrooms: 6,
        furnished: true,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Charming Studio Apartment",
        description: "A cozy and charming studio apartment ideal for young professionals. Located near major tech hubs and public transit. Features modern amenities and an open floor plan.",
        address: "321 Pine Street, San Francisco, CA 94102",
        regularPrice: 1800,
        discountPrice: 1600,
        bathrooms: 1,
        bedrooms: 1,
        furnished: true,
        parking: false,
        type: "rent",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Rustic Mountain Cabin",
        description: "Escape to nature in this rustic mountain cabin. Features a stone fireplace, wraparound deck with mountain views, and a fully equipped kitchen. Perfect weekend getaway or vacation rental.",
        address: "55 Mountain Trail, Aspen, CO 81611",
        regularPrice: 450000,
        discountPrice: 430000,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        type: "sale",
        offer: false,
        imageUrls: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Spacious Loft in Arts District",
        description: "Industrial-chic loft in the vibrant Arts District. Features exposed brick walls, 14-foot ceilings, and oversized windows. Walking distance to galleries, restaurants, and nightlife.",
        address: "900 Arts Blvd, Los Angeles, CA 90013",
        regularPrice: 3200,
        discountPrice: 2900,
        bathrooms: 1,
        bedrooms: 2,
        furnished: false,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Elegant Townhouse with Garden",
        description: "A beautifully maintained townhouse with a private garden. Features original hardwood floors, a renovated kitchen, and a rooftop terrace with city views. Ideal for families.",
        address: "222 Elm Street, Chicago, IL 60601",
        regularPrice: 520000,
        discountPrice: 490000,
        bathrooms: 3,
        bedrooms: 4,
        furnished: false,
        parking: true,
        type: "sale",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
            "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
        ],
        userRef: "seed_user_001",
    },
    {
        name: "Penthouse Suite with Skyline Views",
        description: "Luxurious penthouse with breathtaking skyline views. Features a private elevator, chef-grade kitchen, marble bathrooms, and a spacious terrace perfect for entertaining.",
        address: "1000 Park Avenue, New York, NY 10028",
        regularPrice: 8500,
        discountPrice: 7800,
        bathrooms: 3,
        bedrooms: 4,
        furnished: true,
        parking: true,
        type: "rent",
        offer: true,
        imageUrls: [
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
        ],
        userRef: "seed_user_001",
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB!");

        const count = await Listing.countDocuments();
        if (count > 0) {
            console.log(`Database already has ${count} listings. Skipping seed.`);
        } else {
            await Listing.insertMany(sampleListings);
            console.log(`Successfully seeded ${sampleListings.length} listings!`);
        }

        await mongoose.disconnect();
        console.log("Done!");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exit(1);
    }
}

seed();
