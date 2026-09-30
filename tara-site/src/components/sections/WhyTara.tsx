import { Container } from "@/components/ui/Container";
import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { homepageTrust } from "@/content/homepage";
export function WhyTara() {
  return (
    <section className="border-b border-black/10 py-12">
      <Container>
        <h2 className="font-editorial text-4xl">Order with confidence.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7">{homepageTrust.body}</p>
        <PurchaseReassurance compact className="mt-6" />
        <details className="mt-5 border-b border-black/15 py-4">
          <summary className="cursor-pointer py-2 font-medium">
            Inside the house
          </summary>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {homepageTrust.credentials.map((item) => (
              <article key={item.title}>
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-7">{item.body}</p>
              </article>
            ))}
          </div>
        </details>
      </Container>
    </section>
  );
}
