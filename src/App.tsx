import { ChangeEvent, useState } from 'react'
import Logo from '../src/assets/Logo.svg'
import NewNoteCard from './components/NewNoteCard'
import NoteCard from './components/NoteCard'

interface Note{
  id: string
  date: Date
  content: string
}

const App = ()=> {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')
    if(notesOnStorage){
      return JSON.parse(notesOnStorage);
    }else{
      return []
    }
  });

  const [search, setSearch] = useState('');

  function onNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = ([newNote, ...notes])
    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDelete(id:string){
    const notesArray = notes.filter(note =>{
      return note.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))

  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value
    setSearch(query)
   
  }

  const filteredNotes = search !== ''
  ? notes.filter(note =>note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  : notes

  return ( 
    <div className='max-w-6xl mx-auto my-12 space-y-5 px-5'>
        <img src={Logo} alt="Logo" />

        <form className='w-full  space-y-6'>
          <input
            type='text'
            placeholder="Busque em suas notas"
            className='w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500'
            onChange={handleSearch}
            />
        </form>
        <div className='h-px  bg-slate-700'/>
        <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
         <NewNoteCard onNoteCreated={onNoteCreated}/>
         {filteredNotes.map((note)=>(
          <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
         ))}
        </div>
    </div>
  )
}

export default App
