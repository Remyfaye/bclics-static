"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

import { Cookies } from "react-cookie";

import { useSession } from "next-auth/react";
import { categories } from "@/constants";
import { useRouter } from "next/router";
import UploadImage from "@/components/layout/UploadImage";
import { redirect } from "next/navigation";

const Upload = () => {
  const router = useRouter();
  const session = useSession();
  // console.log(session.data);
  // const vendor = session.data?.user.email;
  const cookie = new Cookies();
  const vendor = cookie.get("userId");

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [extraprice, setExtraPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [sizeItem, setSizeItem] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [isChosingImage, setIsChosingImage] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   if (!vendor) return;

  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${vendor}`);

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         return;
  //       }

  //       const data = await response.json();
  //       setUser(data);
  //       // console.log(data);
  //     } catch (err) {
  //       console.error("Error fetching user:", err);
  //       setError("Error fetching user");
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const addSize = () => {
    const sizeObject = {
      sizeItem: sizeItem,
      extraprice: extraprice,
    };
    setSizeItem("");
    setExtraPrice("");
    setSizes([...sizes, sizeObject]);
    console.log(sizes);
  };

  const data = {
    name: name,
    price: price,
    description: description,
    location: location,
    image: image,
    category: category,
    contact: contact,
    vendor: vendor,
    featured: featured,
  };

  const createProduct = async () => {
    setIsChosingImage(true);
    console.log(data);
    const createPromise = new Promise(async (resolve, reject) => {
      if (category === "") {
        toast("please choose a category");
      } else {
        try {
          const response = await fetch("/api/product/route", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setMessage(data.message);
            router.push(`/allProducts/${category}`);
          } else {
            const error = await response.json();
          }
        } catch (error) {
          console.error("Error loggin in:", error);
        }
      }
    });

    await toast.promise(createPromise, {
      loading: "creating...",
      success: "created",
      error: "error",
    });

    setImage("");
    setName("");
    setPrice("");
    setDescription("");
    setLocation("");
  };

  const deleteItem = async () => {
    const createPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    if (id === "") {
      toast("pls try again");
    } else {
      await toast.promise(createPromise, {
        loading: "deleting...",
        success: "deleted",
        error: "error",
      });
    }

    setConfirmDelete(false);
  };

  return (
    <section className="pt-10">
      <div className="lg:flex mb-10  mt-[4rem]  gap-10 justify-center">
        <UploadImage
          image={image}
          setImage={setImage}
          setDisabled={setDisabled}
          setIsChosingImage={setIsChosingImage}
          menu
        />
        {/* form */}
        <div className="border mt-5 shadow-xl mx-10 p-5 rounded-xl lg:w-[30rem] ">
          {/* name */}

          <label className="mt-5 flex flex-col gap-3">
            Product name
            <input
              value={name}
              type="text"
              className="mt-[-13px]"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="mt-5 flex flex-col gap-3">
            Price
            <input
              value={price}
              type="number"
              className="mt-[-13px]"
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          {/* categories */}
          <label className="mt-5 flex flex-col gap-3">
            <p className="mb-[-13px]">Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <>
                  <option
                    // onChange={(e) => setCategory(e.target.value)}
                    onSelect={() => alert("onchange")}
                    // className="mt-[-15px]"
                    key={c._id}
                  >
                    {c.name}
                  </option>
                </>
              ))}
            </select>
          </label>

          {/* description */}
          <label className="mt-5 flex flex-col gap-3">
            Description
            <input
              // disabled={isChosingImage}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              className=" text-gray-400 mt-[-13px]"
              // placeholder={phone}
            />
          </label>

          {/* location */}
          <label className="mt-5 flex flex-col gap-3">
            Location
            <input
              // disabled={isChosingImage}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              className=" text-gray-400 mt-[-13px]"
              // placeholder={phone}
            />
          </label>

          {/* contact */}
          <label className="mt-5 flex flex-col gap-3">
            Contact
            <input
              // disabled={isChosingImage}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="tel"
              className=" text-gray-400 mt-[-13px]"
              // placeholder={phone}
            />
          </label>

          <button
            disabled={isChosingImage}
            onClick={createProduct}
            className="bg-primary mt-10 py-5 px-10 w-full text-white text-xl rounded-xl"
          >
            create
          </button>
          {message}
        </div>
      </div>
    </section>
  );
};

export default Upload;
