import '../styles/feedback.css';

const feedbacks = [
  { id: 1, text: 'Great app, very easy to use!', rating: 5 },
  { id: 2, text: 'Would like to see more speaking exercises', rating: 4 },
  { id: 3, text: 'Clean design and good learning structure', rating: 5 }
];

export default function Feedback() {
  return (
    <div className="page">
      <h1>User Feedback</h1>

      {feedbacks.map(f => (
        <div key={f.id} className="card">
          <p>{f.text}</p>
          <strong>⭐ {f.rating}</strong>
        </div>
      ))}
    </div>
  );
}
