// (Server Component)
export default async function UsersPage() {
    // This fetch runs on the server (no client-side code needed here)
    const res = await fetch('http://localhost:3000/api/external');
    const data = await res.json();
    console.log('data -> ', data);

    return (
        <main>
            <h1>Clubs</h1>
            <ul>
                {data?.data?.map((club: any) => (
                    <li key={club.id}>{club.name}</li>
                ))}
            </ul>
        </main>
    );
}