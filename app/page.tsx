import { Suspense } from 'react';
import EventCard from '@/components/EventCard';
import ExploreBtn from '../components/ExploreBtn';
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URL;

const FeaturedEvents = async () => {
  'use cache';
  cacheLife('hours');

  if (!BASE_URI) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not set');
  }

  const response = await fetch(`${BASE_URI}/api/events`);

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  const { events } = await response.json();

  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        {events?.length > 0 &&
          events.map((event: IEvent) => (
            <EventCard
              key={event.slug}
              title={event.title}
              image={event.image}
              location={event.location}
              date={event.date}
              time={event.time}
              slug={event.slug}
            />
          ))}
      </ul>
    </div>
  );
};

const Page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <Suspense fallback={<p className="mt-20">Loading events...</p>}>
        <FeaturedEvents />
      </Suspense>
    </section>
  );
};

export default Page;
