import { createSignal } from 'solid-js';
import { invoke } from '@tauri-apps/api/tauri';
import { getDefaultDirectories } from '@/services/directory.service';

type Directory = {
  path: string;
  checked: boolean;
}

function App() {
  const [name, setName] = createSignal('/Users/geko/tmp'); // Example
  const [list, setList] = createSignal<Directory[]>([]);


  async function greet() {
    const dirs = getDefaultDirectories();
    const response = await invoke('scan', { name: name(), dirs: dirs().join(',') });
    console.log("Response", response);
    setList((response as string[]).map((item) => ({path: item, checked: true})));
  }

  async function removeFolders(){
    for (const item of list().filter((item) => item.checked).map((item) => item.path)) {
      console.log("Removing", item);
      await invoke('clean', { path: item });
    }
  }

  function handleCheck(item:Directory){
    item.checked = !item.checked;
    setList([...list()]);
  }

  return (
    <main class='p-4'>
      <h1 class='text-3xl'>Welcome to project cleaner</h1>
      <p>
        This program will help you to clean your projects by removing unused
        files and folders.
      </p>
      <p>Start by adding paths where you want to clean {name()}</p>
      <input
        type='text'
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
      />
      <button onClick={greet}>Scan folder</button>
      <button onClick={removeFolders}>Remove folders</button>
      {list().filter((item) => item.checked).length}
      <ul>
        {list().map((item) => (
          <li><input type='checkbox' onChange={() => handleCheck(item)} checked={item.checked} />{item.path}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
