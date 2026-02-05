import { useState } from 'react';
import '../styles/content.css';

const taskTypes = [
  'Quiz',
  'Listening',
  'Translation',
  'Vocabulary',
  'Grammar',
  'Dialogue',
  'Video',
  'Reading',
  'Fill in the gaps',
  'Pronunciation',
  'Flashcards',
  'Open answer'
];

export default function Content() {
  const [folder, setFolder] = useState('');
  const [taskType, setTaskType] = useState(taskTypes[0]);
  const [material, setMaterial] = useState('');

  return (
    <div className="page">
      <h1>Content Management</h1>

      <input
        type="text"
        placeholder="Folder name"
        value={folder}
        onChange={e => setFolder(e.target.value)}
      />

      <select value={taskType} onChange={e => setTaskType(e.target.value)}>
        {taskTypes.map(type => (
          <option key={type}>{type}</option>
        ))}
      </select>

      <textarea
        placeholder="Task content / material"
        value={material}
        onChange={e => setMaterial(e.target.value)}
      />

      <button>Add task</button>
    </div>
  );
}
