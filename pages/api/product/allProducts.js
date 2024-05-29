import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  //   const { category } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db("eventhub");

    const products = await db
      .collection("products")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    //   .exec();
    //   .aggregate([{ $sample: { size: 3 } }])

    // const count = await Product.countDocuments().exec();
    // const random = Math.floor(Math.random() * count);
    // const products = Product.aggregate([{ $sample: { size: 3 } }]);

    // console.log(products);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
