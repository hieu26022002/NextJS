interface UserCard {
    name: string;
    age: number;
    isOnline: boolean;
}

export function User({ name, age, isOnline = false }: UserCard) {
    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold">{name}</h2>
            <p>Age: {age}</p>
            <p>Status: {isOnline ? "Online" : "Offline"}</p>
        </div>
    );
}