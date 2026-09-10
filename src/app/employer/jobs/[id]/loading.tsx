import PageSkeleton from "@/components/PageSkeleton";

export default function JobDetailLoading() {
  return <PageSkeleton cards={3} wide withBack withHeader={false} />;
}