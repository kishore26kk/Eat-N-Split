/* eslint-disable react/prop-types */
import { useState } from 'react';

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -50,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 150,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

function Button({ children, onClick }) {
    // console.log(onClick)
    return (
        <button className="button" onClick={onClick}>{children}</button>
        // we should pass the function as a props to the parent Component(Button) as it the html tag
        //  that executes the onClick event of changing the state, it receives the prop from the custom component called Button.
    )
}

export default function App() {

    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friends, setFriends] = useState(initialFriends);
    const [selectedFriends, setSelectedFriends] = useState(null);

    const handleNewFriend = (newFriend) => {
        setFriends(prev => [...prev, newFriend]);
        // handleShowAddFriend();
        setShowAddFriend(false);
    }
    const handleShowAddFriend = () => {
        setShowAddFriend(show => !show)
    }
    const selectedFriend = (friend) => {
        // setSelectedFriends(friend)
        setSelectedFriends((selected) => selected?.id === friend.id ? null : friend);
        setShowAddFriend(false);
    }

    const handleSplitBill = (value) => {
        console.log(value)
        setFriends(friends => friends.map(friend => friend.id === selectedFriends.id ? { ...friend, balance: friend.balance + value } : friend))
        setSelectedFriends(null);
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendList friends={friends} onSelect={selectedFriend} onSelectedFriend={selectedFriends} />
                {showAddFriend && <FormAddFriend onAddFriend={handleNewFriend} />}
                <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add Friend'}</Button>
            </div>
            {selectedFriends && <FormSplitBill selectedFriend={selectedFriends} onSplitBill={handleSplitBill} />}
        </div>
    )
}

function FriendList({ friends, onSelect, onSelectedFriend }) {
    return (
        <ul>
            {friends.map((friend) => <Friend friend={friend} key={friend.id} onSelectFriend={onSelect} selectedFriend={onSelectedFriend} />)}
        </ul>
    )
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
    const isSelected = selectedFriend?.id === friend.id;

    return (
        <li className={isSelected ? 'selected' : ''}>
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>
            {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}₹</p>}
            {friend.balance > 0 && <p className="green">{friend.name} owes You {friend.balance}₹</p>}
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}
            <Button onClick={() => onSelectFriend(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
        </li>
    )
}

function FormAddFriend({ onAddFriend }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://i.pravatar.cc/48")

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !image) return;
        const id = crypto.randomUUID()
        const newFriend = {
            name,
            image: `${image}?=${id}`,
            balance: 0,
            id,
        }
        onAddFriend(newFriend);
        setName("");
        setImage("https://i.pravatar.cc/48")
    }

    return (
        <form className="form-add-friend" onSubmit={handleSubmit}>
            <label>Friend name</label>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <label>Image URL</label>
            <input type='text' value={image} onChange={(e) => setImage(e.target.value)} />
            <Button>Add</Button>
        </form>
    )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const paidByFriend = bill ? bill - paidByUser : '';
    const [whoIsPaying, setWhoIsPaying] = useState("user");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bill || !paidByUser) return;

        onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);

    }
    return (
        <form className="form-split-bill" onSubmit={handleSubmit}>
            <h2>Split a bill with {selectedFriend.name}</h2>
            <label>💰 Bill Amount</label>
            <input type="text" value={bill} onChange={(e) => setBill(+e.target.value)} />
            <label>🧍Your expenses</label>
            <input type="text" value={paidByUser} onChange={(e) => setPaidByUser((+e.target.value) > bill ? paidByUser : (+e.target.value))} />
            <label>🧑‍🤝‍🧑{selectedFriend.name}'s expenses</label>
            <input type="text" disabled value={paidByFriend} />
            <label>🤑 Who is paying the bill</label>
            <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
                <option value="user">You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>
            <Button>Split Bill</Button>
        </form>
    )
}