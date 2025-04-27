import UserDetails from "../components/UserDetails";

const Page = async ({ params }) => {

    if (!params) {
        return <div>Error: No user ID provided</div>;
    }

    return (
        <UserDetails id={params.id} />
    );
};

export default Page;
