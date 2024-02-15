import * as Dialog from '@radix-ui/react-dialog'
import {  X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps{
    onNoteCreated: (content:string)=>void
}

let speechRecognition: SpeechRecognition | null = null

const NewNoteCard = ({onNoteCreated}: NewNoteCardProps)=>{

    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor(){
        setShouldShowOnboarding(false);
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>){
        setContent(event.target.value);
        if(event.target.value === ''){
            setShouldShowOnboarding(true);
        }
    }

    function handleSaveNote(event:FormEvent){
        event.preventDefault();
        if(content === ''){
            return
        }
        
        onNoteCreated(content);

        setContent('');

        setShouldShowOnboarding(true);

        //Vai exibir uma mensagem alerta
        toast.success('Nota criada com sucesso!')
    }

    function handleStartRecording(){
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if(!isSpeechRecognitionAPIAvailable){
            alert('Infelizmente seu navegador não suporta a API de gravação!');
            return
        }
        setIsRecording(true);
        setShouldShowOnboarding(false);
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition 
        speechRecognition = new SpeechRecognitionAPI();
        speechRecognition.lang = 'pt-BR' //reconhece o idioma informado
        speechRecognition.continuous = true // so vai parar de captar e gravar quando estiver false, nao parar se parar de falar
        speechRecognition.maxAlternatives = 1 //caso nao entedner o que falei, pega a primeira e mais precisa alterativa
        speechRecognition.interimResults = true // vai ir escrevendo conforme ouvir, nao vai aguardar terminar de falar

        speechRecognition.onresult = (event) =>{
           const transcripton = Array.from(event.results).reduce((text, result)=>{
            return text.concat(result[0].transcript)
           },'')
           setContent(transcripton);
        }
        speechRecognition.onerror = (event) =>{
            console.error(event)
        }
        speechRecognition.start();

    }

    function handleStopRecording(){
        setIsRecording(false);
        if(speechRecognition !== null){
            speechRecognition.stop();
        }
    }

    return(
        <Dialog.Root>
        <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left overflow-hidden outline-none
                           hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400' >
            <span className='text-sm font-medium text-slate-200'>
                Adicionar nota
            </span>
            <p className='text-sm leading-6 text-slate-400'>
                Grave uma nota em áudio que será convertida em texto automaticamente
            </p>
         </Dialog.Trigger>
           
       <Dialog.Portal>
           <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
           <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
               <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                   <X className='size-5'/>
               </Dialog.Close>
               <form  className='flex flex-1 flex-col'>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                    <span className='text-sm font-medium text-slate-200'>
                            Adicionar nota
                    </span>
                    
                        {shouldShowOnboarding ? (
                            <p className='text-sm leading-6 text-slate-400'>
                                Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto.</button>
                            </p>
                            ):(
                            <textarea 
                                autoFocus
                                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                onChange={handleContentChange}
                                value={content}
                            >

                            </textarea>
                        )}
                    
                    </div>
                {isRecording ?(
                    <button 
                    type='button'
                    onClick={handleStopRecording}
                    className='w-full bg-slate-900 flex items-center justify-center gap-2 py-4 text-center text-sm text-state-300 outline-none font-medium hover:text-slate-100'
                >
                    <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                    Gravando (clique p/ interromper)
                </button>
                ):(
                    <button 
                    type='submit'
                    onClick={handleSaveNote}
                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
                >
                    Salvar Nota
                </button>
                )}
               </form>
           </Dialog.Content>
       </Dialog.Portal>    
      </Dialog.Root>
    )
}
export default NewNoteCard;