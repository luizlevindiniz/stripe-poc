interface Customer {
  id: string;
  name: string;
  email: string;
  metadata: {
    subscription: string | undefined;
  };
}

async function handleCustomerPortal(customerId: string) {
  try {
    const response = await fetch("/api/customer_portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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

const customerId = "cus_QuNpPo3m5ZYmIa";

export default function CustomerPortal({
  customer,
}: Readonly<{ customer: Customer | null }>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-between px-2 text-center">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl ">Subscription</h1>
          <p className="text-lg text-muted-foreground">
            Settings regarding your subscription
          </p>
        </div>
      </div>
      <div className="my-3">
        <div className="flex flex-col justify-center items-center">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-sky-300 w-full max-w-[400px]">
            <div className="p-4">
              <p className="text-gray-600 mb-4">Customer details</p>
              {customer ? (
                <div>
                  <p>Name: {customer.name}</p>
                  <p>Email: {customer.email}</p>
                  <p>
                    Subscription:{" "}
                    {customer.metadata.subscription ? "Active" : "Inactive"}
                  </p>
                </div>
              ) : (
                <div>
                  <p>Customer not found</p>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => handleCustomerPortal(customerId)}
                className="w-full bg-sky-500 text-white py-2"
              >
                Manage subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
