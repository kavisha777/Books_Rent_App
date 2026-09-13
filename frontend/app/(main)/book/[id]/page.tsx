import BookDetailsClient from './BookDetailsClient';

type BookDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;

  return <BookDetailsClient bookId={id} />;
}