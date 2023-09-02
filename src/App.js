import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
export default function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(newFriend) {
    setFriendList((friendList) => [...friendList, newFriend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    setSelectedFriend(friend === selectedFriend ? null : friend);
    setShowAddFriend(false);
  }
  function splitSubmit(value) {
    setFriendList((friendList) =>
      friendList.map((friend) =>
        friend === selectedFriend
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendList={friendList}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend handleAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {!showAddFriend ? 'Add Friend' : 'Close'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          splitSubmit={splitSubmit}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}
function FriendsList({ friendList, handleSelection, selectedFriend }) {
  return (
    <ul>
      {friendList.map((friend) => (
        <Friend
          friend={friend}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, handleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.name === friend.name;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance === 0 ? '' : friend.balance > 0 ? 'green' : 'red'
        }
      >
        {friend.balance === 0
          ? `You and  ${friend.name} are Even`
          : friend.balance < 0
          ? `You owe ${friend.name} Rs.${Math.abs(friend.balance)}`
          : `${friend.name} owes you  Rs.${friend.balance}`}
      </p>
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [friend, setFriend] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');
  function handleAddSubmit(e) {
    e.preventDefault();
    if (!friend || !image) {
      alert('Your Submission was empty');
      return;
    }
    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name: friend,
      image: `${image}?=${id}`,
      balance: 0,
    };
    handleAddFriend(newFriend);
    setFriend('');
    setImage('https://i.pravatar.cc/48');
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleAddSubmit(e)}>
      <label>👭 Friend</label>
      <input
        type="text"
        value={friend}
        onChange={(e) => setFriend(e.target.value)}
      ></input>
      <label>📸 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Submit</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, splitSubmit }) {
  const [bill, setBill] = useState('');
  const [yourExpense, setYourExpense] = useState('');
  const friendExpense = bill ? bill - yourExpense : '';
  const [paidBy, setPaidBy] = useState('you');
  const balance = paidBy === 'you' ? friendExpense : -yourExpense;
  console.log(balance);
  return (
    <form
      className="form-split-bill"
      onSubmit={(e) => {
        e.preventDefault();
        if (!bill || !yourExpense) return;
        splitSubmit(balance);
        setBill('');
        setYourExpense('');
        setPaidBy('you');
      }}
    >
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🧑 Your Expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > bill ? yourExpense : Number(e.target.value)
          )
        }
      ></input>
      <label>👭 X's Expense</label>
      <input type="number" disabled value={friendExpense}></input>
      <label>🤑 Who is Paying</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
