import EventCard from '@/components/EventCard/EventCard';
import ExploreBtn from '../components/ExploreBtn/ExploreBtn';
import { events } from '@/lib/constants';

const Page = async () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event) => (
            <EventCard
              key={event.title}
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
    </section>
  );
};

export default Page;
