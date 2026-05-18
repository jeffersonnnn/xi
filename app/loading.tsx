import { FootballSpinner } from '@/components/FootballSpinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <FootballSpinner />
    </div>
  );
}
