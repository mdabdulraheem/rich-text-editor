import RichTextEditor from './components/RichTextEditor';
import './App.scss';
import { EditorState, convertToRaw } from 'draft-js';
import { STORAGE_KEY } from './components/RichTextEditor/utils/common';

function App() {
    const handleOnSave = (editorState: EditorState) => {
        // Save editor content to local storage
        const contentState = editorState.getCurrentContent();
        const contentRaw = convertToRaw(contentState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contentRaw));
        alert('Saved');
    };

    return (
        <div className="App">
            <main>
                <RichTextEditor name={'Raheem'} showSaveButton={true} onSave={handleOnSave} />
            </main>
        </div>
    );
}

export default App;
