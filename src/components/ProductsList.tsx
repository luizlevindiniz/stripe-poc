import Image from "next/image";
import { redirect } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  default_price: string;
  metadata: {
    subscription: string | undefined;
  };
}

interface ProductsPageProps {
  products: Product[];
}

async function handleCheckout(
  priceId: string,
  subscription: string | undefined,
  customerId: string
) {
  try {
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        subscription,
        customerId,
      }),
    });

    const { url, error } = await response.json();

    if (error) {
      console.error("Failed to create checkout session:", error);
      return;
    }

    window.location.href = url;
  } catch (err) {
    console.error("Failed to create checkout session:", err);
  }
}

const customerId = "cus_Qu5mjfBbdxL7vX";
export default function ProductsList({
  products,
}: Readonly<ProductsPageProps>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-sky-300"
            >
              {product.images[0] && (
                <div className="relative h-48">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="300px"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
              </div>
              <div>
                <button
                  className="bg-sky-500 text-white w-full py-2"
                  type="button"
                  onClick={() =>
                    handleCheckout(
                      product.default_price,
                      product.metadata.subscription,
                      customerId // depois vai ficar salvo no DB
                    )
                  }
                >
                  Buy now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </div>
  );
}
