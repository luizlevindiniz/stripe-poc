import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  default_price: string;
}

interface MembershipPageProps {
  membership: Product | null;
}

async function handleCheckout(priceId: string, customerId: string) {
  try {
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
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

const customerId = "cus_QuXF0OpOUTl75w";
export default function MembershipCard({
  membership,
}: Readonly<MembershipPageProps>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Membership</h1>
      {membership ? (
        <div className="flex flex-col justify-center items-center">
          <div
            key={membership.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-sky-300 w-full max-w-[400px]"
          >
            {membership.images[0] && (
              <div className="relative h-48">
                <Image
                  src={membership.images[0]}
                  alt={membership.name}
                  fill
                  priority
                  sizes="300px"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{membership.name}</h2>
              <p className="text-gray-600 mb-4">{membership.description}</p>
            </div>
            <div>
              <button
                className="bg-sky-500 text-white w-full py-2 disabled:bg-gray-300"
                type="button"
                onClick={() =>
                  handleCheckout(
                    membership.default_price,
                    customerId // depois vai ficar salvo no DB
                  )
                }
              >
                Purchase
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </div>
  );
}
