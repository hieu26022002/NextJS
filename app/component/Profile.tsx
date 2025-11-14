interface ProfileCard {
    name: string;
    email?: string;
    age: number;
}

export default function Profile({ name, email, age }: ProfileCard) {
    return (
        <div>
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="mt-2">Email: {email}</p>
            <p className="mt-1 text-gray-500">Age: {age}</p>
        </div>
    )
}