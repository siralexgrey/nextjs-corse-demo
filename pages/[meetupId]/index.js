import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupDetail.title}</title>
        <meta
          name='description'
          content={props.meetupDetail.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupDetail.image}
        title={props.meetupDetail.title}
        address={props.meetupDetail.address}
        description={props.meetupDetail.description}
      />
    </>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect('mongodb+srv://sirAlexGrey:dIwLe0eTWxNW7ObB@cluster0.pllmh.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
  }
}

export const getStaticProps = async (context) => {
  // fetch data for single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect('mongodb+srv://sirAlexGrey:dIwLe0eTWxNW7ObB@cluster0.pllmh.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});

  return {
    props: {
      meetupDetail: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    }
  }
}

export default MeetupDetails;
